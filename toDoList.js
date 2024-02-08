//este iria en la carpeta js/models/task
var TaskModel = Backbone.Model.extend({
  defaults: {
    title: '',
    completed: false,
  },
  toggle: function () {
    this.set('completed', !this.get('completed')); //xq hace este toggle aca?
  },
});

//este iria en la carpeta js/collections/tasks
var TasksCollection = Backbone.Collection.extend({
  model: TaskModel,
});

// Archivo: js/views/tasksView.js

var TaskView = Backbone.View.extend({
  tagName: 'li',
  // Define el template directamente aquí
  template: _.template('<input type="checkbox"><span><%= title %></span>'),
  events: {
    click: 'toggleTask',
  },
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSONz()));
    return this;
  },
  toggleTask: function () {
    this.model.toggle();
  },
});

var TasksView = Backbone.View.extend({
  tagName: 'ul',
  initialize: function () {
    this.listenTo(this.collection, 'add', this.renderTask);
  },
  render: function () {
    this.collection.each(this.renderTask, this);
    return this;
  },
  renderTask: function (task) {
    var taskView = new TaskView({ model: task });
    this.$el.append(taskView.render().el);
  },
});

$(document).ready(function () {
  var tasksCollection = new TasksCollection([
    { title: 'tarea 1' },
    { title: 'Tarea 2' },
    { title: 'Tarea 3' },
  ]);

  var tasksView = new TasksView({ collection: tasksCollection });
  $('#app').html(tasksView.render().el);
});
// Vista de tarea individual
var TaskView = Backbone.View.extend({
  tagName: 'li',
  // Define el template directamente aquí
  template: _.template(
    '<input type="text" class="taskInput" value="<%= title %>" placeholder="<%= title %>"></input> <button type="submit" id="buttonDelete">x</button>'
  ),
  events: {
    'dblclick .taskInput': 'editTask', // Doble clic para editar tarea
    'keypress .taskInput': 'updateOnEnter', // Presionar Enter para guardar
    'blur .taskInput': 'close', // Salir del input para guardar
    'click #buttonDelete': 'deleteTaskOnClick',
  },
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
  editTask: function (e) {
    $(e.target).addClass('editing'); // Agregar clase para indicar edición
  },
  updateOnEnter: function (e) {
    if (e.which === 13) { // 13 es el código de tecla para Enter
      this.close();
    }
  },
  close: function () {
    var value = this.$('.taskInput').val().trim();
    if (value) {
      this.model.set('title', value);
      this.model.save(); // Guardar cambios en el modelo
    }
    this.$('.taskInput').removeClass('editing'); // Remover clase de edición
  },
  deleteTaskOnClick: function () {
    this.model.destroy();
    this.remove();
  },
});
