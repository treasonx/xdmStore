# Cross Domain localStorage

When writing third-party JavaScript applications we want to have a mechanism for
persistent client side storage across multiple domains. This library provides an 
async `localStorage` like API to a page hosted on a common domain in a hidden iframe.

Using this library you can store data client side and access it from any domain. 

`bower install xdm-store`

## Setup

You will need to store the `src/remote.html` page on a domain which you have
control over. S3 or a CDN will work well for most use cases.

This library has zero dependencies and will export itself as an AMD module in an
AMD environment. 

It does depend on `postMessage` and should work in IE9+.

## Examples

Once we have our `src/remote.html` page stored somewhere we can now use our 
persistent cross domain data store.

### Connecting to the store

```javascript
xdmStore.getStore({
  remote: 'http://example.com/remote.html'
}, function (err, store) {
  if(err) {
    // error connecting to remote store
    console.log(err);
    return;
  }
  
  //store is now ready to use.
  console.log(store);
});
```

### Setting data

```javascript
store.setItem('someKey', JSON.stringify({foo: 'bar'}), function (err, resp) {
  if(err) {
    // error setting item.
    console.log(err);
    return;
  }

  // Item has been saved
  console.log(resp);
});
```

### Getting data

```javascript
store.getItem('someKey', function (err, resp) {
  if(err) {
    // error getting item.
    console.log(err);
    return;
  }

  // got item
  console.log(resp);
});
```

### Removing data

```javascript
store.removeItem('someKey', function (err, resp) {
  if(err) {
    // error removing item.
    console.log(err);
    return;
  }

  // item removed
  console.log(resp);
});
```

