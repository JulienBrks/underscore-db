// UUID
// https://gist.github.com/LeverOne/1308368
/* jshint ignore:start */
function uuid(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b}
/* jshint ignore:end */

module.exports = {
  // Empties properties
  __empty: function(doc) {
    this.forEach(doc, function(value, key) {
      delete doc[key];
    });
  },

  // Copies properties from an object to another
  __update: function(dest, src) {
    this.forEach(src, function(value, key) {
      dest[key] = value;
    });
  },

  // Removes an item from an array
  __remove: function(array, item) {
    var index = this.indexOf(array, item);
    if (index != -1) array.splice(index, 1);
  },

  __id: function(key) {
    if (this.rewriteId !== 'id') {
      if (typeof this.rewriteId === 'object') {
        // console.log('key + value', key, this.rewriteId[key]);
        if (this.rewriteId[key]) {
          return this.rewriteId[key]
        }
      } else {
        return this.rewriteId
      }
    } else {
      return 'id';
    }
    var id = this.id || 'id';
    return id;
  },

  id: function(collection, key) {
        return this.__id(key);
          
  },

  getById: function(collection, id, key) {
    var self = this;
    return this.find(collection, function(doc) {
      return doc[self.__id(key)] === id;
    });
  },

  createId: function(collection, doc) {
    return uuid();
  },

  insert: function(collection, doc, key) {
    if (doc[this.__id(key)]) {

      // id is set
      var d = this.getById(collection, doc[this.__id(key)]);
      if (d) {
        // replace properties of existing object
        this.__empty(d);
        this.assign(d, doc);
      } else {
        // push new object
        collection.push(doc);
      }
    } else {
      // create id and push new object
      doc[this.__id(key)] = this.createId(collection, doc, key);
      collection.push(doc);
    }

    return doc;
  },

  updateById: function(collection, id, attrs) {
    var doc = this.getById(collection, id);

    if (doc) this.assign(doc, attrs, {id: id});

    return doc;
  },

  updateWhere: function(collection, predicate, attrs) {
    var self = this;
    var docs = this.filter(collection, predicate);

    docs.forEach(function(doc) {
      self.assign(doc, attrs, {id: doc.id});
    });

    return docs;
  },

  replaceById: function(collection, id, attrs) {
    var doc = this.getById(collection, id);

    if (doc) {
      this.__empty(doc);
      this.assign(doc, attrs, {id: id});
    }

    return doc;
  },

  removeById: function(collection, id) {
    var doc = this.getById(collection, id);

    this.__remove(collection, doc);

    return doc;
  },

  removeWhere: function(collection, predicate) {
    var self = this;
    var docs = this.filter(collection, predicate);

    docs.forEach(function(doc) {
      self.__remove(collection, doc);
    });

    return docs;
  }
};
