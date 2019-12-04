(function() {

  function qs(sel, ctx) {
    ctx = ctx || document;
    return ctx.querySelector(sel);
  }

  function toArray(obj) {
    return [].slice.call(obj);
  }

  // Variaveis
  var list = [],
      ul = qs('#shopping-list'),
      form = qs('#shopping-list-form'),
      emptyMessage = qs('#empty-message');

  function renderItem(item) {
    return [
      '<li class="list-group-item d-flex align-items-center gutters">',
        '<input type="checkbox" aria-label="done"' + (item.done ? ' checked' : '') + '>',
        '<input type="text" class="form-control" placeholder="Name" value="' + item.name + '">',
        '<input type="text" class="form-control w-25" placeholder="Quantity" value="' + item.quantity + '">',
        '<button type="button" class="btn btn-outline-danger"><svg><use xlink:href="#icon-remove"></use></svg></button>',
      '</li>'
    ].join('');
  }

  function saveList() {

  }

  function checkListStatus() {
    emptyMessage.classList.toggle('d-none', list.length);
  }

  function addItem(item) {
    list.push(item);
    ul.innerHTML += renderItem(item);
    checkListStatus();
    saveList();
  }

  function removeItem(index) {
    var li = elm.parentNode;
    var lis = toArray(ul.children);
    console.log(lis.indexOf(li))
  }

  function editItem(index) {

  }

  form.addEventListener('submit', function(evt) {
    evt.preventDefault();
    var elements = toArray(evt.target.elements),
        item = {done: false,};

    elements.forEach(function(element) {
      if (element.type !== 'submit') {
      item[element.name] = element.type === 'checkbox' ? element.checked : element.value;
      }
    });

    addItem(item);
    form.reset();
  });


  ul.addEventListener('click', function (evt) {
    console.log(evt.target);
    if(evt.target && evt.target.matches('btn-outline-danger')){
      console.log('removeItem')
    };
  });

  checkListStatus();

  window.awesomeShoppingList = {
    addItem: addItem
  };

})();