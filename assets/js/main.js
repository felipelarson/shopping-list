(function() {

  function qs(sel, ctx) {
    ctx = ctx || document;
    return ctx.querySelector(sel);
  }

  function toArray(obj) {
    return [].slice.call(obj);
  }

  var list = [],
      ul = qs('#shopping-list'),
      form = qs('#shopping-list-form'),
      emptyMessage = qs('#empty-message');

  function renderItem(name, quantity, done) {
    return [
      '<li class="list-group-item d-flex align-items-center gutters">',
        '<input type="checkbox" aria-label="done"' + (done ? ' checked' : '') + '>',
        '<input type="text" class="form-control" placeholder="Name" value="' + name + '">',
        '<input type="text" class="form-control w-25" placeholder="Quantity" value="' + quantity + '">',
        '<button type="button" class="btn btn-outline-danger"><svg><use xlink:href="#icon-remove"></use></svg></button>',
      '</li>'
    ].join('');
  }

  function saveList() {

  }

  function checkListStatus() {
    emptyMessage.classList.toggle('d-none', list.length);
  }

  function addItem(name, quantity, done) {
    list.push({name: name, quantity: quantity, done: done});
    ul.innerHTML += renderItem(name, quantity, done);
    checkListStatus();
    saveList();
  }

  function removeItem(index) {

  }

  function editItem(index) {

  }

  form.addEventListener('submit', function(evt) {
    evt.preventDefault();
    var elements = toArray(evt.target.elements);
    var obj = {};

    elements.forEach(function(element) {
      obj[element.name] = element.type === 'checkbox' ? element.checked : element.value;
    });

    addItem(obj.name, obj.quantity, obj.done);

    form.reset();
  });

  checkListStatus();

  window.awesomeShoppingList = {
    addItem: addItem
  };

})();
