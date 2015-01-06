(function (g) {

  var key = 'foo';
  var value = {some: 'data'};

  function logError(method, cb) {
    return function (err, result) {
      if(err) {
        console.log('Error calling ' + method);
        console.log(err);
        return;
      }
      cb(result);
    };
  }

  function setData(store, cb) {
    var json = JSON.stringify(value);
    store.setItem(key, json, logError('setData', cb));
  }

  function getData(store, cb) {
    store.getItem(key, logError('getData', function (result) {
      cb(JSON.parse(result));
    }));
  }

  function removeData(store, cb) {
    store.removeItem(key, logError('removeData', cb));
  }

  xdmStore.getStore({
    remote: 'http://localhost:4001/src/remote.html'
  }, function (error, store) {

    if(error) {
      console.log('error creating store!');
      console.log(error);
      return;
    }

    console.log('setting data');
    setData(store, function (result) {
      console.log('setting data complete');
      console.log(result);
      console.log('=======================');
      console.log('getting data');
      getData(store, function (result) {
        console.log('getting data complete');
        console.log(result);
        console.log('=======================');
        console.log('removing data');
        removeData(store, function (result) {
          console.log('removing data complete');
          console.log(result);
          console.log('=======================');
          console.log('getting data');
          getData(store, function (result) {
            console.log('getting data complete');
            console.log(result);
            console.log('=======================');
            console.log('Demo complete!');
          });
        });
      });
    });

  });

 }(this));

