console.log('myscript.js carregado.');

// Seleciona os elementos importantes
  //Tabela
  const botaoCadastro = document.getElementById("btn-add");
  const tabelaUsuarios = document.getElementById('userlist');
  const botaoExpande = document.getElementById('btn-show');
  var tamanhoLista = 5;

  // Modal
  var modalInfo = {'tipo': 'criar'};
  const modal = document.getElementById('modal')
  const modalSalvar = document.getElementById('modalSave');
  const modalFecha1 = document.getElementById('modalClose1');
  const modalFecha2 = document.getElementById('modalClose2');
  const modalFormulario = document.getElementById('form');
  const modalNome = document.getElementById('inputName');
  const modalEmail = document.getElementById('inputEmail');
// Cria RegExp para o nome e email
const regexNome = /^[a-zA-ZÀ-ÖØ-öø-ÿ'’ '-]{4,60}$/;
const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Cria os event listeners para os botões
  // Misc
  window.addEventListener('click', event => {
    if(event.target.id === 'modal') {
      event.target.classList.add('js__none');
    }
  });
  // Tabela
  botaoCadastro.addEventListener('click', () => {
    form.reset();
    modalInfo = {'tipo': 'criar'};
    modal.classList.remove('js__none');
    modalClose1.focus({focusVisible: true});
  });
  botaoExpande.addEventListener('click', () => {
    if(tamanhoLista < listaUsuarios.length) {
      tamanhoLista += 5;
      listaAtual = filtraLista(listaUsuarios, tamanhoLista);
      updateView();
    } else {
      alert('Não há mais usuários na lista.');
    }
  });
  // Modal
  modalFormulario.addEventListener('submit', event => {
    event.preventDefault();
    const nome = modalNome.value;
    const email = modalEmail.value;

    // Checa o nome
    if(!regexNome.test(nome)) {
      return;
    }
    // Checa o email
    if(!regexEmail.test(email)) {
      alert('O e-mail inserido é inválido!\nPor favor, tente novamente.');
      return;
    }
    if(modalInfo.tipo === 'criar') {
      // Avisa caso o nome seja repetido
      if(listaUsuarios.map(usuario => usuario.nome).includes(nome)) {
        if(!confirm('O nome inserido já foi utilizado antes. Continuar?')) return;
      }
      // Avisa caso o email já existe
      if(listaUsuarios.map(usuario => usuario.email).includes(email)) {
        alert('O e-mail inserido já foi cadastrado.');
        return;
      }
      // Adiciona o usuário se tudo estiver certo
      alteraLocalstorage({
        'action': 'add',
        'nome': nome,
        'email': email
      });
    } else if(modalInfo.tipo === 'editar') {
      alteraLocalstorage({
        'action': 'edit',
        'nome': nome,
        'email': email,
        'index': modalInfo.index
      });
    }

    form.reset();
    modal.classList.add('js__none');
  });
  modalFecha1.addEventListener('click', () => modal.classList.add('js__none'));
  modalFecha2.addEventListener('click', () => {
    modalFormulario.reset();
    modal.classList.add('js__none');
  });

// Cria ou carrega a lista de usuários
let listaUsuarios = (() => {
  if(!localStorage.getItem('db_users') || JSON.parse(localStorage.getItem('db_users')).usuarios.length <= 0) {
    localStorage.setItem('db_users', JSON.stringify({
      "usuarios": [
        {
          "nome": "Rafael",
          "email": "rafael@protonmail.ch"
        },
        {
          "nome": "Paulo",
          "email": "paulo@gmail.com.br"
        },
        {
          "nome": "Maria",
          "email": "maria@hotmail.com"
        },
        {
          "nome": "Adão",
          "email": "adao@outlook.com.br"
        },
        {
          "nome": "João",
          "email": "joao@yahoo.com"
        },
        {
          "nome": "Ana",
          "email": "ana@aol.com"
        }
      ]
    }));
  }
  return Array.from(JSON.parse(localStorage.getItem('db_users')).usuarios);
})();

// Função utilizada para alterar o local storage e a lista de usuários
function alteraLocalstorage(object) {
  if(object.action === 'add') {
    listaUsuarios.unshift({
      "nome": object.nome,
      "email": object.email
    });
  } else if(object.action === 'edit') {
    listaUsuarios[object.index] = {
      "nome": object.nome,
      "email": object.email
    }
    console.log(listaUsuarios[object.index]);
  } else if(object.action === 'delete') {
    listaUsuarios.splice(object.index, 1);
  }
  // Altera o localstorage, recria a lista e recarrega a tabela após adicionar, editar ou excluir um usuário
  localStorage.setItem('db_users', JSON.stringify({'usuarios': listaUsuarios}));
  listaAtual = filtraLista(listaUsuarios, tamanhoLista);
  updateView();
}

// Função que atualiza a variável lista no front-end
function filtraLista(array, tamanho) {
  const tamanhoMax = tamanho > array.length ? array.length : tamanho;
  return (array.filter((usuario, index) => index < tamanhoMax));
}
let listaAtual = filtraLista(listaUsuarios, tamanhoLista);

// Deleta o usuário alvo da lista de usuários
function deletaUsuario(usuario, target) {
  confirm('Por favor confirme para excluir.\nEssa ação não poderá ser revertida.') && (() => {
    alteraLocalstorage({'action': 'delete', 'index': listaAtual.indexOf(usuario)});
    target.remove();
  })();
}

// Adiciona um usuálio na tabela
function adicionaUsuario(usuario, index) {
  const tr = document.createElement('tr');
  tr.classList.add('table__row');

  const td = [];
  const tdClasses = ['cell--name', 'cell--email', 'cell--button-list'];

  const spanIcons = document.createElement('span');
  spanIcons.classList.add('button-list');
  
  for(let i = 0; i < 3; i++) {
    td.push(document.createElement('td'));
    td[i].classList.add("row__cell", tdClasses[i]);
    switch(true) {
      case i === 0:
        const nameSpan = document.createElement('span');
        nameSpan.classList.add('spanDots');
        nameSpan.innerText = usuario.nome;
        td[i].appendChild(nameSpan);
        break;
      case i === 1:
        const emailSpan = document.createElement('span');
        emailSpan.classList.add('spanDots');
        emailSpan.innerText = usuario.email;
        td[i].appendChild(emailSpan);
        break;
      case i === 2:
        const editButton = document.createElement('button');
        editButton.classList.add('cell__button--edit');
        editButton.addEventListener('click', () => {
          modalNome.value = usuario.nome;
          modalEmail.value = usuario.email;
          modalInfo = {'tipo': 'editar', 'index': index};
          modal.classList.remove('js__none')
        });
        const editSpan = document.createElement('span');
        editSpan.classList.add('hidden');
        editSpan.innerText = 'Editar Usuário';
        editButton.appendChild(editSpan);
        td[i].appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('cell__button--delete');
        deleteButton.addEventListener('click', () => {
          deletaUsuario(usuario, tr);
        });
        const deleteSpan = document.createElement('span');
        deleteSpan.classList.add('hidden');
        deleteSpan.innerText = 'Deletar Usuário';
        deleteButton.appendChild(deleteSpan);
        td[i].appendChild(deleteButton);

        break;
    }
  }
  td.forEach(cell => tr.appendChild(cell));
  tabelaUsuarios.appendChild(tr);
}

// Update inicial da lista
listaAtual.forEach((usuario, index) => adicionaUsuario(usuario));

updateView();
// Muda a tabela visualizada pelo usuário
function updateView() {
  // Remove a todos os elementos da tabela antiga
  while(tabelaUsuarios.firstChild) {
    tabelaUsuarios.lastChild.remove();
  }
  listaAtual.forEach((usuario, index) => adicionaUsuario(usuario, index));
}