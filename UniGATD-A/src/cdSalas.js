'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_sala')) ?? []
const setLocalStorage = (dbSala) => localStorage.setItem("db_sala", JSON.stringify(dbSala))

// CRUD - create read update delete

//teste inserir dados
const tempSala = {
    numero: "aaa",
    bloco: "llll",
    andar: "pppp"
} //teste

const deleteSala = (index) => {
    const dbSala = readSala()
    dbSala.splice(index, 1)
    setLocalStorage(dbSala)
}

const updateSala = (index, sala) => {
    const dbSala = readSala()
    dbSala[index] = sala
    setLocalStorage(dbSala)
}

const readSala = () => getLocalStorage()

const createSala = (sala) => {
    const dbSala = getLocalStorage()
    dbSala.push (sala)
    setLocalStorage(dbSala)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('numero').dataset.index = 'new'
    document.querySelector(".modal-head>h2").textContent  = 'Nova Sala'
}

const saveSala = () => {
    if (isValidFields()) {
        const sala = {
            numero: document.getElementById('numero').value,
            bloco: document.getElementById('bloco').value,
            andar: document.getElementById('andar').value
        }
        const index = document.getElementById('numero').dataset.index
        if (index == 'new') {
            createSala(sala)
            updateTable()
            closeModal()
        } else {
            updateSala(index, sala)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (sala, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${sala.numero}</td>
        <td>${sala.bloco}</td>
        <td>${sala.andar}</td>
        <td class="tb-acao">
            <button type="button" class="btn-action" id="edit-${index}">Editar</button>
            <button type="button" class="btn-action" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableSala>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableSala>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbSala = readSala()
    clearTable()
    dbSala.forEach(createRow)
}

const fillFields = (sala) => {
    document.getElementById('numero').value = sala.numero
    document.getElementById('bloco').value = sala.bloco
    document.getElementById('andar').value = sala.andar
    document.getElementById('numero').dataset.index = sala.index
}

const editSala = (index) => {
    const sala = readSala()[index]
    sala.index = index
    fillFields(sala)
    document.querySelector(".modal-head>h2").textContent  = `Editando ${sala.numero}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editSala(index)
        } else {
            const sala = readSala()[index]
            const response = confirm(`Deseja realmente excluir a sala ${sala.numero}`)
            if (response) {
                deleteSala(index)
                updateTable()
            }
        }
    }
}



updateTable()

// Eventos
document.getElementById('cadastrarSala')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveSala)

document.querySelector('#tableSala>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)