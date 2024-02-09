 // Modelo de tarea
 var TaskModel = Backbone.Model.extend({
  urlRoot: '/tasks',
  defaults: {
    title: '',
  },
});

// Colección de tareas
var TasksCollection = Backbone.Collection.extend({
  model: TaskModel,
});

// Vista de tarea individual
var TaskView = Backbone.View.extend({
  tagName: 'li',
  // Define el template directamente aquí
  template: _.template(
    '<div><input type="text" id="task" value="<%= title %>"></input>   <button type="submit" id="buttonDelete">x</button></div>'
  ),
  events: {
    'dblclick #task': 'editTask',
    'keypress #task': 'editTaskOnEnter',
    'blur #task': 'close', // Salir del input para guardar
    'click #buttonDelete': 'deleteTaskOnClick',
  },
  initialize: function () {
    this.isEditing = false;
    this.listenTo(this.model, 'change', this.render);
  },
  render: function () {
    var readonly = this.isEditing ? '' : 'readonly';
    this.$el.html(this.template(this.model.toJSON()));
    this.$('#task').prop('readonly', readonly);
    return this;
  },
  editTaskOnEnter: function (e) {
    if (e.which === 13) {
      this.model.set('title', this.$('#task').val().trim());
      this.model.save();
      this.isEditing = false;
      this.render();
    }
  },
  deleteTaskOnClick: function () {
    this.model.destroy();
    this.remove();
  },
  editTask: function () {
    this.isEditing = true;
    this.render();
  },
  close: function (e) {
    this.model.set('title', this.$('#task').val().trim());
    this.model.save();
    this.isEditing = false;
    this.render();
  },
});

// Vista de lista de tareas
var TasksView = Backbone.View.extend({
  tagName: 'ul',
  initialize: function () {
    this.listenTo(this.collection, 'add', this.renderTask);
  },
  template: _.template(
    '<h1>TO DO LIST</h1>' + 
    '<div>' +
    '<input type="text" id="inputTask" placeholder="Add Task ..."></input>' +
    '<button type="submit" id="buttonTask">+</button>' +
    '</div>'
  ),
  render: function () {
    this.$el.html(this.template());
    this.collection.each(this.renderTask, this);
    return this;
  },
  renderTask: function (task) {
    var taskView = new TaskView({ model: task });
    this.$el.append(taskView.render().el);
  },
  events: {
    'keypress #inputTask': 'createTaskOnEnter',
    'click #buttonTask': 'createTaskOnClick',
  },
  createTaskOnEnter: function (e) {
    if (e.which === 13) {
      var newTaskTitle = $('#inputTask').val().trim();
      if (newTaskTitle) {
        this.collection.add({ title: newTaskTitle });
        $('#inputTask').val('');
      }
    }
  },
  createTaskOnClick: function () {
    var newTaskTitle = $('#inputTask').val().trim();
    if (newTaskTitle) {
      this.collection.add({ title: newTaskTitle });
      $('#inputTask').val('');
    }
  },
});

// Inicialización de la aplicación
$(document).ready(function () {
  var tasksCollection = new TasksCollection();

  var tasksView = new TasksView({ collection: tasksCollection });

  $('#app').html(tasksView.render().el);
});