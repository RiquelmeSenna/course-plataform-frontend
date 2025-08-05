const token = localStorage.getItem('token')
let userName = document.querySelector('#user p')
let explore = document.querySelector('.explore')
let categoriesDiv = document.querySelector('.categories')
let categoriesList = document.querySelector('.categories ul')
let userDiv = document.querySelector('#user')
let logout = document.querySelector('#logout')


userDiv.addEventListener('click', () => {
    window.location.replace('../../pages/home/user.html')
})

async function changeName() {
    const url = 'https://course-plataform-backend.onrender.com/users/me'

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
    const url = 'https://course-plataform-backend.onrender.com/categories'

    const categories = await fetch(url)

    const response = await categories.json()

    response.categories.forEach((item) => {
        let list = document.createElement('li')
        list.append(item.name)
        categoriesList.appendChild(list)
        list.addEventListener('click', async () => {
            const url = `https://course-plataform-backend.onrender.com/categories/find/${list.innerHTML}`

            const category = await fetch(url)

            const response = await category.json()
            if (response) {
                localStorage.setItem('category', JSON.stringify(response))
                window.location.replace('../home/categories.html')
            }
        })
    })
}

addCategories()

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

changeName()

logout.addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location.replace('../../pages/auth/login.html')
})
