(function() {

  /* UTILS */
  function qs(sel, ctx) {
    ctx = ctx || document;
    return ctx.querySelector(sel);
  }

  function toArray(obj) {
    return [].slice.call(obj);
  }

  function findIndex(elm, parent) {
    var elms = toArray(parent.children);
    return elms.indexOf(elm);
  }

  function getValue(elm) {
    return elm.type === 'checkbox' ? elm.checked : elm.value;
  }

  function loadData(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch(err) {
      console.log(err);
    }
  }

  function saveData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch(err) {
      console.log(err);
    }
  }

  /* VARS */
  var list = loadData('shoppingList') || [],
      ul = qs('#shopping-list'),
      form = qs('#shopping-list-form'),
      emptyMessage = qs('#empty-message'),
      moodText = qs('.mood-text'),
      moodEmoji = qs('.mood-emoji');

  /* METHODS */
  function renderItem(item) {
    return [
      '<li class="list-group-item d-flex align-items-center gutters">',
        '<input type="checkbox" name="done" aria-label="done"' + (item.done ? ' checked' : '') + '>',
        '<input type="text" name="name" class="form-control" placeholder="Name" value="' + item.name + '">',
        '<input type="text" name="quantity" class="form-control w-25" placeholder="Quantity" value="' + item.quantity + '">',
        '<button type="button" class="btn btn-outline-danger" data-action="remove"><svg><use xlink:href="#icon-remove"></use></svg></button>',
      '</li>'
    ].join('');
  }

  function updateListStatus() {
    var length = list.length;
    emptyMessage.classList.toggle('d-none', length);
    switch (true) {
      case !length:
        moodText.innerHTML = 'Sad';
        moodEmoji.innerHTML = '😢';
        break;
      case length >= 5:
        moodText.innerHTML = 'Awesome';
        moodEmoji.innerHTML = '😎';
        break;
      default:
        moodText.innerHTML = 'Happy';
        moodEmoji.innerHTML = '😀';
        break;
    }
  }

  function addItem(item) {
    list.push(item);
    ul.innerHTML += renderItem(item);
    updateListStatus();
    saveData('shoppingList', list);
  }

  function removeItem(elm) {
    var li = elm.parentNode,
        index = findIndex(li, ul);
    
    list.splice(index, 1);
    ul.removeChild(li);
    updateListStatus();
    saveData('shoppingList', list);
  }

  function updateItem(elm) {
    var li = elm.parentNode,
        index = findIndex(li, ul);

    list[index][elm.name] = getValue(elm);
    saveData('shoppingList', list);
  }

  /* EVENT HANDLERS */
  function handleFormSubmit(evt) {
    evt.preventDefault();
    var formElements = toArray(evt.target.elements),
        item = {
          done: false,
        };

    formElements.forEach(function(elm) {
      if (elm.type !== 'submit') {
        item[elm.name] = getValue(elm);
      }
    });

    addItem(item);
    form.reset();
  }

  function handleListEvents(evt) {
    var elm = evt.target;
    switch (true) {
      case evt.type === 'click' && elm.matches('[data-action="remove"]'):
        // outras maneiras:
        // elm.dataset.action === 'remove'
        // elm.getAttribute('data-action') === 'remove'
        removeItem(elm);
        break;
      default:
        updateItem(elm);
        break;
    }
  }

  /* EVENT LISTENERS */
  form.addEventListener('submit', handleFormSubmit);
  ul.addEventListener('click', handleListEvents);
  ul.addEventListener('input', handleListEvents);

  /* INIT */
  updateListStatus();
  ul.innerHTML = list.map(function(item) {
    return renderItem(item);
  }).join('');

  /* EXPORT (optional) */
  window.awesomeShoppingList = {
    addItem: addItem,
  };

})();
