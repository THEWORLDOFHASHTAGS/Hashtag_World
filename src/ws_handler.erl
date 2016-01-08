-module(ws_handler).
-behaviour(cowboy_websocket_handler).
-export([init/3, websocket_init/3, websocket_handle/3, websocket_info/3, websocket_terminate/3, connect_db/0]).
-export([list_to_tuplelist/1, count_occurances/2]).
-record(state, {}).

init({tcp, http}, _Req, _Opts) ->
	%%start couchbeam and dependencies
	application:start(asn1),
	application:start(crypto),
    application:start(public_key),
    application:start(ssl),
    application:start(idna),
    application:start(mimerl),
    application:start(certifi),
    application:start(hackney),
    application:start(couchbeam),

    %%connect to couchdb
    connect_db(),
    {upgrade, protocol, cowboy_websocket}.

 websocket_init(_TransportName, Req, _Opts) ->
 	{ok, Req, #state{}}.

 %% handle a connection to the socket
 %% receive the country Id as 'Msg' and open the document in the database with that _id 

websocket_handle({text, Msg}, Req, State) ->
    {ok, Doc} = open_doc(Msg),
    % get the data stored in the 'tweet' field from the document
    Data = couchbeam_doc:get_value(<<"data">>, Doc),
	DataTuples = list_to_tuplelist(Data),
	io:format("Data tuples? ~p~n", [DataTuples]),

    %Turn the data into a list of bitstrings listed in descending order of popularity.
    OccuranceList = count_occurances(Data, gb_trees:empty()),
	io:format("Occurance list: ~p~n", [OccuranceList]),
	Occurancies = get_occurances(gb_trees:iterator(OccuranceList), []),
	io:format("Occurancies: ~p~n", [Occurancies]),
	Popular = lists:sort(fun({KeyA, ValA}, {KeyB, ValB}) -> {ValA, KeyA} >= {ValB, KeyB} end,
		Occurancies),
	io:format("Popular: ~p~n", [Popular]),
	PopList = get_key(Popular),
	io:format("PopList: ~p~n", [PopList]),
    % send a reply to the website with the data
	{reply, {text, PopList}, Req, State};

websocket_handle(_Data, Req, State) ->
	{ok, Req, State}.

websocket_info({timeout, _Ref, Msg}, Req, State) ->
	{reply, {text, Msg}, Req, State};

websocket_info(_Info, Req, State) ->
	{ok, Req, State}.

websocket_terminate(_Reason, _Req, _State) ->
	ok.


%% open the database 'countries'
connect_table() ->
    couchbeam:open_db(connect_db(), "testdb", []).

%% Open a particular document within the database using it's _id
open_doc(Id) ->
    {ok, Db} = connect_table(),
    couchbeam:open_doc(Db, Id).

connect_db() ->
	couchbeam:server_connection("127.0.0.1", 5984, "", []).

%%Take a list of values and turn it into a list of tuples with {Key, Value}, where
%%Key is our original value and Value is 1.
list_to_tuplelist([H|[]]) ->
	[{H, 1}];
list_to_tuplelist([H|T]) ->
	[{H, 1}] ++ list_to_tuplelist(T).

%%Takes a list of Key, Value tuples and a tree. If the Key is already in the tree,
%%its value is incremented. Otherwise, a node is created with the key and Value 1.
count_occurances([], Occurance) -> Occurance;
count_occurances([H|T], Occurance) ->
	case gb_trees:is_defined(H, Occurance) of
		true ->
			Count = gb_trees:get(H, Occurance),
			NewTree = gb_trees:update(H, Count + 1, Occurance),
			count_occurances(T, NewTree);
		false ->
			NewTree = gb_trees:insert(H, 1, Occurance),
			count_occurances(T, NewTree)
	end.


get_occurances(Iter, L) ->
	case gb_trees:next(Iter) of
		none -> L;
		{Key, Value, NewIter} ->
			NewList = L ++ [{Key, Value}],
			get_occurances(NewIter, NewList)
	end.

%%Takes a list of Key, Value tuples and returns a list of the keys in the same order.
get_key([H|[]]) -> 
	case H of
		{Key, _} -> [Key]
	end;
get_key([H|T]) ->
	case H of
		{Key, _} -> [Key] ++ "," ++ get_key(T)
	end.
