(function() {

  /* UTILS */

  /* atalho para o querySelector */
  function qs(sel, ctx) {
    ctx = ctx || document;
    return ctx.querySelector(sel);
  }

  /* converte um array-like object para um array verdadeiro */
  function toArray(obj) {
    return [].slice.call(obj);
  }

  /* encontra o índice de um elemento relativamente ao seu antecessor */
  function findIndex(elm, parent) {
    var elms = toArray(parent.children);
    return elms.indexOf(elm);
  }

  /* obtém o valor de um input */
  function getValue(elm) {
    return elm.type === 'checkbox' ? elm.checked : elm.value;
  }

  /* tenta carregar os dados do localStorage */
  function loadData(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch(err) {
      console.log(err);
    }
  }

  /* tenta guardar os dados para o localStorage */
  function saveData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch(err) {
      console.log(err);
    }
  }


  /* VARS */
  var list = loadData('shoppingList') || [], // tenta carregar os dados do localStorage, caso contário inicializa a lista como um array vazio
      ul = qs('#shopping-list'), // selecciona a UL que vai conter os items
      form = qs('#shopping-list-form'), // selecciona o formulário de novo item
      units = ['', 'kg', 'g', 'l', 'cl', 'm', 'cm'], // valores para lista de unidades
      emptyMessage = qs('#empty-message'), // selecciona o elemento que contém a mensagem de lista vazia
      moodText = qs('.mood-text'), // selecciona o elemento que contém a palavra da emoção
      moodEmoji = qs('.mood-emoji'); // selecciona o elemento que contém o emoji da emoção


  /* METHODS */

  /* renderiza o HTML para um item da lista */
  function renderItem(item) {
    return [
      '<li class="list-group-item d-flex align-items-center gutters">',
        '<input type="checkbox" name="done" aria-label="done"' + (item.done ? ' checked="checked"' : '') + '>',
        '<input type="text" name="name" class="form-control" placeholder="Name" value="' + item.name + '">',
        '<div class="input-group flex-nowrap">',
          '<input type="number" name="quantity" class="form-control" placeholder="Quantity" value="' + item.quantity + '">',
          '<div class="input-group-append">',
            '<select class="custom-select" name="unit">',
              units.map(function(unit) {
                return '<option value="' + unit + '"' + (unit === item.unit ? 'selected' : '') + '>' + (unit || 'units') + '</option>';
              }).join(''),
            '</select>',
          '</div>',
        '</div>',
        '<button type="button" class="btn btn-outline-danger" data-action="remove"><svg><use xlink:href="#icon-remove"></use></svg></button>',
      '</li>'
    ].join('');
  }

  /* verifica se a lista está vazia e altera a emoção consoante o número de items na lista */
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

  /*
    - adiciona um item ao array da lista
    - adiciona o item ao DOM
    - actualiza a mensagem e emoção da lista
    - guarda os dados da lista para localStorage
  */
  function addItem(item) {
    list.push(item);
    ul.innerHTML += renderItem(item);
    updateListStatus();
    saveData('shoppingList', list);
  }

  /*
    - encontra o índice do item que queremos remover
    - remove-o item do array da lista
    - remove-o do DOM
    - actualiza a mensagem e emoção da lista
    - guarda os dados da lista para localStorage
  */
  function removeItem(elm) {
    var li = elm.parentNode,
        index = findIndex(li, ul);
    
    list.splice(index, 1);
    ul.removeChild(li);
    updateListStatus();
    saveData('shoppingList', list);
  }

  /*
    - encontra o índice do item que queremos actualizar
    - actualiza a propriedade do item consoante o input que estamos a alterar
    - guarda os dados da lista para localStorage
  */
  function updateItem(elm) {
    var li = elm.parentNode,
        index = findIndex(li, ul);

    list[index][elm.name] = getValue(elm);
    saveData('shoppingList', list);
  }

  /* EVENT HANDLERS */

  /*
    - lida com o submit do formulário de novo item
    - evita a acção por omissão do formulário
    - inicializa um objecto de novo item
    - popula o objecto com os valores dos campos do formulário
    - adiciona o item à lista
    - limpa os campos do formulário
  */
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

  /*
    - lida com as acções da lista
    - verifica o tipo de evento que foi despoletado
    - verifica o tipo de elemento que foi clicado e invoca o método correspondente
  */
  function handleListEvents(evt) {
    var elm = evt.target;
    switch (true) {
      case evt.type === 'click':
        if (elm.matches('[data-action="remove"]')) removeItem(elm);
        /* 
          outras maneiras de fazer isto:
          if (elm.dataset.action === 'remove') removeItem(elm);
          if (elm.getAttribute('data-action') === 'remove') removeItem(elm);
        */
        break;
      case evt.type === 'input':
        updateItem(elm);
        break;
      default:
        break;
    }
  }


  /* EVENT LISTENERS */

  /* adiciona o handler de submit ao formulário de novo item */
  form.addEventListener('submit', handleFormSubmit);

  /* adiciona o handler de acções à lista para eventos do tipo click e input */
  ul.addEventListener('click', handleListEvents);
  ul.addEventListener('input', handleListEvents);


  /* INIT */

  /* inicializa o estado da mensagem e emoção da lista */
  updateListStatus();

  /* renderiza o HTML da lista caso existam dados guardados */
  ul.innerHTML = list.map(function(item) {
    return renderItem(item);
  }).join('');


  /* EXPORT (opcional) */

  /* disponibiliza os métodos da closure para o scope global */
  window.awesomeShoppingList = {
    addItem: addItem,
  };

})();