// auth api
const axiosConfig = {
    headers: {
        authorization: 'Bearer' + ' ' + localStorage.getItem('token')
    }
}


function authUser() {
    const inputEmail = document.getElementById('email')
    const inputPassword = document.getElementById('password')

    const email = inputEmail.value
    const password = inputPassword.value

    axios.post('http://localhost:4000/auth', { email, password }).then(response => {
        const token = response.data.token

        localStorage.setItem('token', token)


        axiosConfig.headers.authorization = 'Bearer' + ' ' + localStorage.getItem('token')

    }).catch(err => {
        console.log('Erro ao autenticar usuário: ' + err)
    })
}

//  getMusic
function getMusics() {
    axios.get('http://localhost:4000/musics', axiosConfig).then(response => {
        if (response.status == 200) {
            const showMusics = document.getElementById('showMusics')

            const musics = response.data

            musics.forEach(music => {

                const item = document.createElement('p')

                item.innerHTML = `
                    ID: ${music.id} <br>
                    Título: ${music.title} <br>
                    Ano: ${music.year} <br>
                    Cantor/a: ${music.singer} <br>
                    <button class="btn btn-warning btn-sm" onclick="editMusic(this)">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteMusic(${music.id})">Deletar</button>

                `

                item.setAttribute('data-id', music.id)
                item.setAttribute('data-title', music.title)
                item.setAttribute('data-year', music.year)
                item.setAttribute('data-singer', music.singer)

                showMusics.appendChild(item)
            })
        }
    }).catch(err => console.log('Erro ao obter músicas: ' + err))
}
getMusics()

// getMusic
function getMusic(id) {
    axios.get('http://localhost:4000/music/' + id, axiosConfig).then(response => {
        if (response.status == 200) {
            const music = response.data

            const item = document.createElement('p')

            item.innerHTML = ` 
                ID: ${music.id} <br>
                Título: ${music.title} <br>
                Ano: ${music.year} <br>
                Cantor/a: ${music.singer}
            `

            document.getElementById('showMusic').appendChild(item)
        }
    }).catch(err => console.log('Erro ao obter Música: ' + err))
}
getMusic(2)


// addMusic
function addMusic(music) {
    axios.post('http://localhost:4000/music', music).then(response => {
        if (response.status == 201) {

            alert('Música adicionada com sucesso!')

            document.getElementById('id').value = ''
            document.getElementById('title').value = ''
            document.getElementById('year').value = ''
            document.getElementById('singer').value = ''

        }
    }).catch(err => console.log('Erro ao adicionar música: ' + err))
}
// createMusic
function createMusic() {
    const inputId = document.getElementById('id')
    const inputTitle = document.getElementById('title')
    const inputYear = document.getElementById('year')
    const inputSinger = document.getElementById('singer')


    const music = {
        id: inputId.value,
        title: inputTitle.value,
        year: inputYear.value,
        singer: inputSinger.value
    }

    addMusic(music)
}

//updateMusic
function updateMusic(idMusic) {

    document.getElementById('btnUpdate').addEventListener('click', () => {

        const id = idMusic

        const editId = document.getElementById('editId')
        const editTitle = document.getElementById('editTitle')
        const editYear = document.getElementById('editYear')
        const editSinger = document.getElementById('editSinger')

        const newMusic = {
            title: editTitle.value,
            year: editYear.value,
            singer: editSinger.value
        }

        axios.put('http://localhost:4000/music/' + id, newMusic).then(response => {
            if (response.status = 201) {

                alert('Música atulizada com isso!')

                document.getElementById('editId').value = ''
                document.getElementById('editTitle').value = ''
                document.getElementById('editYear').value = ''
                document.getElementById('editSinger').value = ''
            }
        }).catch(err => console.log('Erro ao atualizar música: ' + err))

    })
}

// editMusic
function editMusic(item) {

    const music = item.parentNode

    const editId = document.getElementById('editId')
    const editTitle = document.getElementById('editTitle')
    const editYear = document.getElementById('editYear')
    const editSinger = document.getElementById('editSinger')

    const id = music.getAttribute('data-id')
    const title = music.getAttribute('data-title')
    const year = music.getAttribute('data-year')
    const singer = music.getAttribute('data-singer')

    editId.value = id
    editTitle.value = title
    editYear.value = year
    editSinger.value = singer

    document.getElementById('btnUpdate').focus()

    updateMusic(id)

}

// deleteMusic
function deleteMusic(id) {

    axios.delete('http://localhost:4000/music/' + id).then(response => {
        if (response.status == 200) {
            alert('Músic deletada com sucesso!')
        }
    }).catch(err => console.log('Erro ao deletar música: ' + err))
}