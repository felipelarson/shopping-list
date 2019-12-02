(function() {
  
  var list = [],
      mood = document.querySelector('.mood'),
      form = document.getElementById('shopping-list'),
      ul = form.querySelector('ul');

  function addItem(name, quantity) {

    list.push({
      name: name,
      quantity: quantity,
    });

    var id = 'list-item-' + list.length,
        item = [
          '<li class="list-group-item d-flex justify-content-between">',
            '<div class="form-check">',
              '<input class="form-check-input" type="checkbox" id="' + id + '">',
              '<label class="form-check-label" for="' + id + '">',
                name,
              '</label>',
            '</div>',
            '<span class="quantity">' + quantity + '</span>',
          '</li>',
        ].join('');

    ul.classList.toggle('d-none', !list.length);
    ul.innerHTML += item;
  }

  function removeItem() {

  }

  function updateItem() {

  }

  function checkListMood() {

  }

  function saveList() {

  }

  function loadList() {

  }

  function initList() {
    if (!list.length) { }
  }

  window.AWESOME_SHOPPING_LIST = {
    addItem: addItem,
  };

})();
