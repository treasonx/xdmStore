(function (g) {

  var stores = {};
  var id = 0;
  var pendingCommands = {};

  g.addEventListener('message', function (evt) {
    var resp = evt.data;
    var cb = pendingCommands[resp.id] || function(){};

    delete pendingCommands[resp.id];

    if(resp.error) {
      cb(resp);
    } else {
      cb(null, resp.result);
    }
  });

  function uniqueId() {
    return ++id + '_command';
  }

  function createFrame(url, cb) {

    var iframe = g.document.createElement('iframe');
    var targetOrigin = g.location;
    var id = uniqueId();
    var receiver;

    function onReady(err, resp) {

      if(err) {
        return cb(err);
      }

      if(resp.xdmReady) {
        cb(null, receiver);
      }

    }

    pendingCommands[id] = onReady;

    iframe.style.display = 'none';
    iframe.src = url + '#' + encodeURIComponent(targetOrigin) + '&' + id;
    g.document.body.appendChild(iframe);
    receiver = iframe.contentWindow;
  }

  function createStore(url, cb) {
    createFrame(url, function (err, receiver) {

      var store;

      if(err) {
        return cb(err);
      }

      function makeCall(fn, args, cb) {

        var command = {
          id: uniqueId(),
          action: 'storage',
          fnName: fn,
          args: args
        };

        pendingCommands[command.id] = cb;

        receiver.postMessage(command, url);
      }

      store = {
        getItem: function (key, cb) {
          makeCall('getItem', [key], cb);
        },
        setItem: function (key, val, cb) {
          makeCall('setItem', [key, val], cb);
        },
        removeItem: function (key, cb) {
          makeCall('removeItem', [key], cb);
        },
      };

      store[url] = store;

      cb(null, store);
    });
  }

  function factory () {

    return {
      getStore: function (options, cb) {
        var store = stores[options.remote];

        if(!store) {
          createStore(options.remote, cb);
        } else {
          cb(null, store);
        }

      }
    };

  }

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    g.xdmStore = factory();
  }

}(this));

