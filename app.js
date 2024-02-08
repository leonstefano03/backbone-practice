console.log('holaaa');

// Definimos el modelo
var ItemModel = Backbone.Model.extend({
  defaults: {     
    name: '',
    age: 0,
    city: ''
  }
})
console.log(Backbone.Model);
// Definimos la vista
var ItemView = Backbone.View.extend({
  tagName: 'tr',
  template: _.template($('#item-template').html()),

  events: {
    'click .delete': 'deleteItem'
  },

  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  deleteItem: function(){
    this.model.destroy(); 
    this.remove();
  }
});

// Creamos una colección
var ItemCollection = Backbone.Collection.extend({
  model: ItemModel
})

// Instanciamos la colección  (instancia de la collection)
var items = new ItemCollection();

//creamos algunos datos de ejemplo

items.add([
  { name: 'Leon Stefano', age: 21, city: 'chacabuco'},
  { name: 'juan Stefano', age: 50, city: 'chacabuco'},
  { name: 'nicolas Stefano', age: 20, city: 'chacabuco'},
])

// Creamos la vista principal que contiene la tabla y los botones
var AppView = Backbone.View.extend({
  el: '#app',

  initialize: function(){
    this.render();
  },

  render: function(){
    var self = this;

    //renderizamos la tabla
    var $table = $('<table>');
    this.collection.each(function(item){
      var itemView = new ItemView({model: item});
      $table.append(itemView.render().el);
    });

    //creamos un boton para agregar elementos
    var $addButton = $('<button>Add Item</button>').click(function(){
      self.addItem()
    });

    //lo añadimos al dom
    this.$el.empty().append($table).append($addButton);
    return this;
  },

  addItem: function(){
    var name = prompt('enter person name:');
    var age = prompt('enter person age:');
    var city = prompt('enter person city:');
    if (name && age && city) {
      this.collection.add({name: name, age: age, city: city});
      this.render();
    }
  }
});

// Template para los elementos de la tabla
var itemTemplate = '<td><%= name %></td><td><%= age %></td><td><%= city %></td><td><button class="delete">Delete</button></td>';
$(document).ready(function() {
  $('body').append('<script type="text/template" id="item-template">' + itemTemplate + '</script>');
});

//instanciamos la vista principal
var appView = new AppView({ collection: items});

