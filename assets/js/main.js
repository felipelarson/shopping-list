(function() {
  
    var list = [],
        mood = document.querySelector('.mood'),
        empty = document.querySelector('.empty')
        form = document.getElementById('shopping-list'),
        ul = form.querySelector('ul'),
        itemForm = document.getElementById('item-form'),
        newItemButton = document.getElementById('button-new'),
        addItemButton = document.getElementById('button-add'),
        cancelItemButton = document.getElementById('button-cancel');
  
    function addItem(name, quantity) {
  
      list.push({name: name, quantity: quantity,});
  
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

    function newItem(event) {
        console.log(event);
        itemForm.classList.remove('d-none');
        addItemButton.classList.replace('d-none', 'd-inline-flex');
        newItemButton.classList.replace('d-inline-flex', 'd-none');
        cancelItemButton.classList.replace('d-none', 'd-inline-flex');
    }
  
    function checkListMood() {
  
    }
  
    function saveList() {
  
    }
  
    function loadList() {
        
    }
  
    empty.classList.toggle('d-none', list.length);
    newItemButton.addEventListener('click', newItem)
  
    window.AWESOME_SHOPPING_LIST = {
      addItem: addItem,
      newItem: newItem
    };
  
  })();