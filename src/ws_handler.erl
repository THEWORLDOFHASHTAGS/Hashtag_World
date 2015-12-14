-module(ws_handler).
-behaviour(cowboy_websocket_handler).
-export([init/3]).
-export([websocket_init/3]).
-export([websocket_handle/3]).
-export([websocket_info/3]).
-export([websocket_terminate/3]).
-record(state, {
}).

init({tcp, http}, _Req, _Opts) ->
    %% start couchbeam and dependencies
    application:start(asn1),
    application:start(crypto),
    application:start(public_key),
    application:start(ssl),
    application:start(idna),
    application:start(mimerl),
    application:start(certifi),
    application:start(hackney),
    application:start(couchbeam),
    %% connect to couchdb
    couchbeam:server_connection("127.0.0.1", 5984, "", []),
    {upgrade, protocol, cowboy_websocket}.

websocket_init(_TransportName, Req, _Opts) ->
    {ok, Req, #state{}}.

%% handle a connection to the socket
%% receive the country Id as 'Msg' and open the document in the database with that _id 

websocket_handle({text, Msg}, Req, State) ->
    {ok, Doc} = open_doc(Msg),
    % get the data stored in the 'tweet' field from the document
    Data = couchbeam_doc:get_value(<<"data">>, Doc),
    io:format("Retrieved: ~p~n", [Data]),
    % send a reply to the website with the data
    {reply, {text, Data}, Req, State};

websocket_handle(_Data, Req, State) ->
    {ok, Req, State}.

websocket_info({timeout, _Ref, Msg}, Req, State) ->
    {reply, {text, Msg}, Req, State};

websocket_info(_Info, Req, State) ->
    {ok, Req, State}.

websocket_terminate(_Reason, _Req, _State) ->
    ok.

%% connect to couchdb

connect_db() ->
    couchbeam:server_connection("127.0.0.1", 5984, "", []).

%% open the database 'countries'
connect_table() ->
    couchbeam:open_db(connect_db(), "testdb", []).

%% Open a particular document within the database using it's _id
open_doc(Id) ->
    {ok, Db} = connect_table(),
    couchbeam:open_doc(Db, Id).
