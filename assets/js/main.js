(function() {

  /* UTILS */

  /*
    atalho para o querySelector
    https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
    https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
  */
  function qs(sel, ctx) {
    ctx = ctx || document;
    return ctx.querySelector(sel);
  }

  /*
    converte um array-like object para um array verdadeiro
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#Array-like_objects
  */
  function toArray(obj) {
    return [].slice.call(obj);
  }

  /*
    encontra o índice de um elemento relativamente ao seu antecessor
    https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
  */
  function findIndex(elm, parent) {
    var elms = toArray(parent.children);
    return elms.indexOf(elm);
  }

  /*
    obtém o valor de um input
    https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
  */
  function getValue(elm) {
    return elm.type === 'checkbox' ? elm.checked : elm.value;
  }

  /*
    tenta carregar os dados do localStorage
    https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
  */
  function loadData(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch(err) {
      console.log(err);
    }
  }

  /*
    tenta guardar os dados para o localStorage
    https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
  */
  function saveData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch(err) {
      console.log(err);
    }
  }


  /* VARS */
  var list = loadData('shoppingList') || [], // inicializa a lista com dados do localStorage ou um array vazio
      ul = qs('#shopping-list'), // selecciona a UL que vai conter os items
      form = qs('#shopping-list-form'), // selecciona o formulário de novo item
      units = ['', 'kg', 'g', 'l', 'cl', 'm', 'cm'], // valores para lista de unidades
      moodText = qs('.mood-text'), // selecciona o elemento que contém a palavra da emoção
      moodEmoji = qs('.mood-emoji'), // selecciona o elemento que contém o emoji da emoção
      emptyMessage = qs('#empty-message'); // selecciona o elemento que contém a mensagem de lista vazia


  /* METHODS */

  /*
    renderiza o HTML para um item da lista
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
  */
  function renderItem(item) {
    return [
      '<li class="list-group-item d-flex align-items-center">',
        '<input type="checkbox" name="done" aria-label="done"' + (item.done ? ' checked="checked"' : '') + '>',
        '<input type="text" name="name" class="form-control" placeholder="Name" value="' + item.name + '" required>',
        '<input type="number" name="quantity" class="form-control w-auto pr-0" placeholder="Quantity" value="' + item.quantity + '" min="0" required>',
        '<select class="custom-select w-auto pl-0" name="unit">',
          units.map(function(unit) {
            return '<option value="' + unit + '"' + (unit === item.unit ? 'selected' : '') + '>' + (unit || 'units') + '</option>';
          }).join(''),
        '</select>',
        '<button type="button" class="btn btn-outline-danger" data-action="remove"><svg><use xlink:href="#icon-remove"></use></svg></button>',
      '</li>'
    ].join('');
  }

  /*
    verifica se a lista está vazia e altera a emoção consoante o número de items na lista
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length
    https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
    https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
  */
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
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
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
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
    https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode
    https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
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
    https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
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
    https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit
    https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
    https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
    https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset
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
    https://developer.mozilla.org/en-US/docs/Web/API/Event/target
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
    https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/dataset
    https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
    https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute
  */
  function handleListEvents(evt) {
    var elm = evt.target;

    switch (evt.type) {
      case 'click':
        if (elm.dataset.action === 'remove') removeItem(elm);
        /* 
          outras maneiras de fazer isto:
          if (elm.matches('[data-action="remove"]')) removeItem(elm);
          if (elm.getAttribute('data-action') === 'remove') removeItem(elm);
        */
        break;
      case 'keyup':
      case 'change':
      /*
        case 'input':

        o evento 'input' sintetiza os 2 acima para elementos de formulário,
        mas o suporte em Edge e IE 11 é apenas parcial.
        https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event
      */
        updateItem(elm);
        break;
      default:
        break;
    }
  }


  /*
    EVENT LISTENERS
    https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    https://developer.mozilla.org/en-US/docs/Web/Events
  */

  /*
    adiciona o handler de submit ao formulário de novo item
    https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit
  */
  form.addEventListener('submit', handleFormSubmit);

  /*
    adiciona o handler de acções à lista para eventos do tipo click, keyup e change
    https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event
  */
  ul.addEventListener('click', handleListEvents);

  /*
    adiciona o handler de acções à lista para eventos do tipo keyup e change
    https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event
    https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
  */
  ul.addEventListener('keyup', handleListEvents);
  ul.addEventListener('change', handleListEvents);
  /*
    ul.addEventListener('input', handleListEvents);
    
    o evento 'input' sintetiza os 2 acima para elementos de formulário,
    mas o suporte em Edge e IE 11 é apenas parcial.
    https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event
  */


  /* INIT */

  /* inicializa o estado da mensagem e emoção da lista */
  updateListStatus();

  /*
    renderiza o HTML da lista caso existam dados guardados
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
  */
  ul.innerHTML = list.map(function(item) {
    return renderItem(item);
  }).join('');
  /*
    outra maneira:
    list.forEach(function(item) {
      ul.innerHTML += renderItem(item);
    });
  */


  /* EXPORT (opcional) */

  /* disponibiliza os métodos da closure para o scope global */
  window.awesomeShoppingList = {
    addItem: addItem,
  };

})();
