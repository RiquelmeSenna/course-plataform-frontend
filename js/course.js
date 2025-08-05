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
    const url = 'http://localhost:4000/users/me'

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

logout.addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location.replace('../../pages/auth/login.html')
})



async function courseInfo() {
    const courseId = localStorage.getItem('idCourse')
    const url = `https://plataforma-de-curso.onrender.com/courses/${courseId}`

    const course = await fetch(url)
    const response = await course.json()

    const courseCategory = document.querySelector('.course-category-badge')
    const courseTittle = document.querySelector('.course-title')
    const courseDescription = document.querySelector('.course-description')
    const coursePrice = document.querySelector('.course-price')
    const listModule = document.querySelector('.modules-list')

    response.course.module.forEach((item, index) => {
        //Criar os elementos
        const li = document.createElement('li')
        const number = document.createElement('div')
        number.innerHTML = index + 1
        number.classList.add('module-number')
        const divText = document.createElement('div')
        const title = document.createElement('span')
        title.classList.add('module-title')
        const description = document.createElement('span')
        description.classList.add('module-desc')

        //Colocar os textos nos elementos

        title.innerHTML = item.name
        description.innerHTML = item.description

        //Colocar um elemento dentro do outro

        divText.appendChild(title)
        divText.appendChild(description)
        li.appendChild(number)
        li.appendChild(divText)
        listModule.appendChild(li)

    })

    courseCategory.innerHTML = response.course.category.name
    courseTittle.innerHTML = response.course.name
    courseDescription.innerHTML = response.course.description
    coursePrice.innerHTML = `R$ ${response.course.price},00`
}

let matriculationButton = document.querySelector('.enroll-btn')

matriculationButton.addEventListener('click', async () => {
    const courseId = localStorage.getItem('idCourse')

    let url = 'https://plataforma-de-curso.onrender.com/enrollments'

    const enrollment = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId: parseInt(courseId) })
    })

    const response = await enrollment.json()

    console.log(response.url)

    window.location.replace(response.url)
})



courseInfo()
changeName()