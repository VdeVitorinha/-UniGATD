'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_prof')) ?? []
const setLocalStorage = (dbProf) => localStorage.setItem("db_prof", JSON.stringify(dbProf))

// CRUD - create read update delete
const deleteProf = (index) => {
    const dbProf = readProf()
    dbProf.splice(index, 1)
    setLocalStorage(dbProf)
}

const updateProf = (index, prof) => {
    const dbProf = readProf()
    dbProf[index] = prof
    setLocalStorage(dbProf)
}

const readProf = () => getLocalStorage()

const createProf = (prof) => {
    const dbProf = getLocalStorage()
    dbProf.push (prof)
    setLocalStorage(dbProf)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent  = 'Novo Professor'
}

const saveProf = () => {
    if (isValidFields()) {
        const prof = {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            matricula: document.getElementById('matricula').value,
            turno: document.getElementById('turno').value,
            desafios: document.getElementById('desafios').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createProf(prof)
            updateTable()
            closeModal()
        } else {
            updateProf(index, prof)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (prof, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${prof.nome}</td>
        <td>${prof.cpf}</td>
        <td>${prof.matricula}</td>
        <td>${prof.turno}</td>
        <td>${prof.desafios}</td>
        <td class="tb-acao">
            <button type="button" class="btn-action" id="edit-${index}">Editar</button>
            <button type="button" class="btn-action" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableProf>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableProf>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbProf = readProf()
    clearTable()
    dbProf.forEach(createRow)
}

const fillFields = (prof) => {
    document.getElementById('nome').value = prof.nome
    document.getElementById('cpf').value = prof.cpf
    document.getElementById('matricula').value = prof.matricula
    document.getElementById('turno').value = prof.turno
    document.getElementById('desafios').value = prof.desafios
    document.getElementById('nome').dataset.index = prof.index
}

const editProf = (index) => {
    const prof = readProf()[index]
    prof.index = index
    fillFields(prof)
    document.querySelector(".modal-header>h2").textContent  = `Editando ${prof.nome}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editProf(index)
        } else {
            const prof = readProf()[index]
            const response = confirm(`Deseja realmente excluir o Professor ${prof.nome}`)
            if (response) {
                deleteProf(index)
                updateTable()
            }
        }
    }
}



updateTable()

// Eventos
document.getElementById('cadastrarProf')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveProf)

document.querySelector('#tableProf>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)
