-module(hashtag_world_app).

-behaviour(application).

%% Application callbacks
-export([start/2, stop/1]).

%% ===================================================================
%% Application callbacks
%% ===================================================================

start(_StartType, _StartArgs) ->
    Dispatch = cowboy_router:compile([
        {'_', [
			{"/", cowboy_static, {priv_file, hashtag_world, "index.html"}},
			{"/websocket", ws_handler, []},
			{"/[...]", cowboy_static, {priv_dir, hashtag_world, "assets",
		    	[{mimetypes, cow_mimetypes, all}]}}
		]}
    ]),
    {ok, _} = cowboy:start_http(http, 100, [{port, 8080}],
        [{env, [{dispatch, Dispatch}]}]
    ),
    hashtag_world_sup:start_link().

stop(_State) ->
    ok.
