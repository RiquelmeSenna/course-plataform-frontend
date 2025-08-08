const token = localStorage.getItem('token')
let userName = document.querySelector('#user p')
let explore = document.querySelector('.explore')
let categoriesDiv = document.querySelector('.categories')
let categoriesList = document.querySelector('.categories ul')
let userDiv = document.querySelector('#user')
let logout = document.querySelector('#logout')


userDiv.addEventListener('click', () => {
    window.location.replace('../home/user.html')
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

async function addCategory() {
    let courses = JSON.parse(localStorage.getItem('category'))

    const ul = document.querySelector('.courses ul')
    const coursesDiv = document.querySelector('.courses')

    if (courses.Courses.length == 0) {
        ul.innerHTML = 'Não há cursos nessa categoria'
        ul.style.fontSize = '30px'
        ul.style.textAlign = 'center'
        ul.style.marginTop = '20px'
        coursesDiv.style.backgroundColor = 'white'
        return
    }

    courses.Courses.forEach(item => {
        let li = document.createElement('li')

        let img = document.createElement('img')
        img.src = '../images/Fundo Azul Liso Papel de Parede Para Download Gratuito - Pngtree..png'

        // Div de texto
        let divLi = document.createElement('div')
        divLi.classList.add('courses-text')
        let h2 = document.createElement('h2')
        h2.id = 'name'
        let h4 = document.createElement('h4')
        h4.id = 'description'
        let p = document.createElement('p')
        p.id = 'teacher'
        let divRating = document.createElement('div')
        divRating.id = 'rating'
        let note = document.createElement('p')
        note.id = 'note'
        let stars = document.createElement('div')
        stars.classList.add('stars')
        let category = document.createElement('p')
        category.id = 'category'
        category.innerHTML = item.category.name
        h2.innerHTML = item.name
        h4.innerHTML = item.description
        p.innerHTML = item.teacher.name
        note.innerHTML = '0'
        divRating.appendChild(note)
        divRating.appendChild(stars)
        divLi.appendChild(h2)
        divLi.appendChild(h4)
        divLi.appendChild(p)
        divLi.appendChild(divRating)
        divLi.appendChild(category)
        ///////////////////////

        // Price
        let price = document.createElement('p')
        price.id = 'price'
        price.innerHTML = `R$<span>${item.price.toFixed(2)}</span>`
        ///////////

        li.appendChild(img)
        li.appendChild(divLi)
        li.appendChild(price)
        ul.appendChild(li)

        li.addEventListener('click', () => {
            const selectedCourse = courses.Courses.find(course => course.name === item.name)
            if (selectedCourse) {
                localStorage.setItem('idCourse', selectedCourse.id)
                window.location.replace('../home/course.html')
            }
        })
    })
}

logout.addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location.replace('../index.html')
})

addCategory()