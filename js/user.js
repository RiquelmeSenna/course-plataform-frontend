const token = localStorage.getItem('token')
let userName = document.querySelector('#user p')
let explore = document.querySelector('.explore')
let categoriesDiv = document.querySelector('.categories')
let categoriesList = document.querySelector('.categories ul')
let editBtn = document.querySelector('#edit-btn')
let saveBtn = document.querySelector("#save-btn")
let cancelBtn = document.querySelector('#cancel-btn')
let logout = document.querySelector('#logout')
let imageInput = document.querySelector('#profile-image-input')
let profileImage = document.querySelector('#profile-image')


async function changeName() {
    const url = 'https://plataforma-de-curso.onrender.com/users/me'

    const user = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    const response = await user.json()
    userName.innerHTML = response.user.name
    if (response.user.type == 'Teacher') {
        let bottomCreate = document.querySelector('#create-course')
        bottomCreate.style.display = 'block'
    }

}

async function addCategories() {
    const url = 'https://plataforma-de-curso.onrender.com/categories'

    const categories = await fetch(url)

    const response = await categories.json()

    response.categories.forEach((item) => {
        let list = document.createElement('li')
        list.append(item.name)
        categoriesList.appendChild(list)
        list.addEventListener('click', async () => {
            const url = `https://plataforma-de-curso.onrender.com/categories/find/${list.innerHTML}`

            const category = await fetch(url)

            const response = await category.json()
            if (response) {
                localStorage.setItem('category', JSON.stringify(response))
                window.location.replace('../home/categories.html')
            }
        })
    })
}

explore.addEventListener('mouseover', () => {
    categoriesDiv.style.marginTop = '0'
})

explore.addEventListener('mouseout', () => {
    categoriesDiv.style.marginTop = '-150vh'
})

categoriesDiv.addEventListener('mouseover', () => {
    categoriesDiv.style.marginTop = '0'
})

categoriesDiv.addEventListener('mouseout', () => {
    categoriesDiv.style.marginTop = '-150vh'
})

let nameInput = document.querySelector('#user-name-text')
let cpf = document.querySelector('#user-cpf-text')
let email = document.querySelector('#user-email-text')
let passwordText = document.querySelector('#user-password-text')
let type = document.querySelector('#user-type-text')

async function addUser() {
    const url = "https://plataforma-de-curso.onrender.com/users/me"

    const user = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    const response = await user.json()

    nameInput.innerHTML = response.user.name
    cpf.innerHTML = response.user.cpf
    email.innerHTML = response.user.email
    type.innerHTML = response.user.type

    if (response.user.profileImage) {
        profileImage.src = `https://plataforma-de-curso.onrender.com/${response.user.profileImage}`
        console.log(profileImage.src)
    } else {
        profileImage.src = '../../images/user-svgrepo-com.svg'
    }
}

imageInput.addEventListener('change', async () => {
    const file = imageInput.files[0]

    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch('https://plataforma-de-curso.onrender.com/users/me/photo', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })

    const result = await response.json()

    if (response.ok) {
        profileImage.src = `https://plataforma-de-curso.onrender.com/${result.imagePath}`

    } else {
        alert('Erro ao enviar imagem')
    }
})

logout.addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location.replace('../../pages/auth/login.html')
})


let inputName = document.querySelector('#user-name-input')
let cpfInput = document.querySelector('#user-cpf-input')
let emailInput = document.querySelector('#user-email-input')
let passwordInput = document.querySelector('#user-password-input')
let typeInput = document.querySelector('#user-type-input')

editBtn.addEventListener('click', () => {
    editBtn.style.display = 'none'
    saveBtn.style.display = 'block'
    cancelBtn.style.display = 'block'
    ////
    inputName.style.display = 'block'
    inputName.value = nameInput.innerHTML
    typeInput.style.display = 'block'
    passwordInput.style.display = 'block'

    nameInput.style.display = 'none'
    type.style.display = 'none'
    passwordText.style.display = 'none'
})

cancelBtn.addEventListener('click', () => {
    nameInput.style.display = 'block'
    type.style.display = 'block'
    passwordText.style.display = 'block'
    passwordText.innerHTML = '******'
    ////
    inputName.style.display = 'none'
    typeInput.style.display = 'none'
    passwordInput.style.display = 'none'

    editBtn.style.display = 'block'
    saveBtn.style.display = 'none'
    cancelBtn.style.display = 'none'

})

saveBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    const url = "https://plataforma-de-curso.onrender.com/users/me"

    const data = {
        name: inputName.value,
        password: passwordInput.value,
        type: typeInput.value
    }

    let updatedUser = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })

    const response = await updatedUser.json()

    let error = document.getElementsByClassName('error')

    if (response.error) {
        if (response.error.password) {
            error[1].innerHTML = response.error.password
            error[0].innerHTML = ''
        } else if (response.error.name) {
            error[0].innerHTML = response.error.name
            error[1].innerHTML = ''
        }
        return
    }

    window.location.reload()


})



addCategories()
addUser()
changeName()

