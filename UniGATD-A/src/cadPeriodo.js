'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_periodo')) ?? []
const setLocalStorage = (dbPeriodo) => localStorage.setItem("db_periodo", JSON.stringify(dbPeriodo))

// CRUD - create read update delete
const deletePeriodo = (index) => {
    const dbPeriodo = readPeriodo()
    dbPeriodo.splice(index, 1)
    setLocalStorage(dbPeriodo)
}

const updatePeriodo = (index, periodo) => {
    const dbPeriodo = readPeriodo()
    dbPeriodo[index] = periodo
    setLocalStorage(dbPeriodo)
}

const readPeriodo = () => getLocalStorage()

const createPeriodo = (periodo) => {
    const dbPeriodo = getLocalStorage()
    dbPeriodo.push (periodo)
    setLocalStorage(dbPeriodo)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('peri').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent  = 'Novo Periodo'
}

const savePeriodo = () => {
    if (isValidFields()) {
        const periodo = {
            peri: document.getElementById('peri').value,
            curso: document.getElementById('curso').value,
            turno: document.getElementById('turno').value,
        }
        const index = document.getElementById('peri').dataset.index
        if (index == 'new') {
            createPeriodo(periodo)
            updateTable()
            closeModal()
        } else {
            updatePeriodo(index, periodo)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (periodo, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${periodo.peri}</td>
        <td>${periodo.curso}</td>
        <td>${periodo.turno}</td>
        <td class="tb-acao">
            <button type="button" class="btn-action" id="edit-${index}">Editar</button>
            <button type="button" class="btn-action" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tablePeriodo>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tablePeriodo>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbPeriodo = readPeriodo()
    clearTable()
    dbPeriodo.forEach(createRow)
}

const fillFields = (periodo) => {
    document.getElementById('peri').value = periodo.peri
    document.getElementById('curso').value = periodo.curso
    document.getElementById('turno').value = periodo.turno
    document.getElementById('peri').dataset.index = periodo.index
}

const editPeriodo = (index) => {
    const periodo = readPeriodo()[index]
    periodo.index = index
    fillFields(periodo)
    document.querySelector(".modal-header>h2").textContent  = `Editando ${periodo.nome}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editPeriodo(index)
        } else {
            const periodo = readPeriodo()[index]
            const response = confirm(`Deseja realmente excluir o Periodo ${periodo.nome}`)
            if (response) {
                deletePeriodo(index)
                updateTable()
            }
        }
    }
}



updateTable()

// Eventos
document.getElementById('cadastrarPeriodo')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', savePeriodo)

document.querySelector('#tablePeriodo>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)
