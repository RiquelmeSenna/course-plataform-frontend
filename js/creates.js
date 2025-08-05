const token = localStorage.getItem('token')
let userName = document.querySelector('#user p')
let explore = document.querySelector('.explore')
let categoriesDiv = document.querySelector('.categories')
let categoriesList = document.querySelector('.categories ul')
let userDiv = document.querySelector('#user')
let buttonCreate = document.querySelector('.btn-create-course')
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
    // Categorias Header
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

    //Categorias selecionar

    let selectCoursecategory = document.querySelector('#course-category')

    response.categories.forEach((item) => {
        let options = document.createElement('option')
        options.append(item.name)
        selectCoursecategory.appendChild(options)
    })
}

addCategories()

changeName()
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

logout.addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location.replace('../../pages/auth/login.html')
})



buttonCreate.addEventListener('click', async (e) => {
    e.preventDefault()
    const urlPost = 'https://course-plataform-backend.onrender.com/courses'


    let courseTitle = document.querySelector('#course-title')
    let courseDescription = document.querySelector("#course-description")
    let courseCategory = document.querySelector('#course-category')
    let coursePrice = document.querySelector('#course-price')

    const urlCategory = `https://course-plataform-backend.onrender.com/categories/find/${courseCategory.value}`

    const category = await fetch(urlCategory)
    const responseCategory = await category.json()

    const data = {
        name: courseTitle.value,
        description: courseDescription.value,
        categoryId: responseCategory.id,
        price: parseInt(coursePrice.value)
    }
    let error = document.querySelectorAll('.error')

    if (data.name.length < 4) {
        error[0].innerHTML = 'O nome deve ter no mínimo 4 caracteres'
    } else {
        error[0].innerHTML = ''
    }
    if (data.description.length < 10) {
        error[1].innerHTML = 'A descrição deve ter no mínimo 10 caracteres'
    } else {
        error[1].innerHTML = ''
    }
    if (data.price < 1) {
        error[2].innerHTML = 'O preço deve ser maior que 0'
    } else {
        error[2].innerHTML = ''
    }


    let newCourse = await fetch(urlPost, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })

    const response = await newCourse.json()
    window.location.reload()

})
