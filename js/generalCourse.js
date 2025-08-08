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

logout.addEventListener('click', () => {
    localStorage.removeItem('token')
    window.location.replace('../index.html')
})

async function fillCourseInfo() {
    const idCourse = localStorage.getItem('idCourse')
    const url = `https://course-plataform-backend.onrender.com/courses/${idCourse}`
    const course = await fetch(url)
    const response = await course.json()

    // course header

    let courseHeaderH2 = document.querySelector('.course-info h2')
    let courseHeaderP = document.querySelector('.course-info p')

    courseHeaderH2.innerHTML = response.course.name
    courseHeaderP.innerHTML = response.course.description

    // course modules

    let moduleList = document.querySelector('.modules-list')

    response.course.module.forEach((item) => {

        let details = document.createElement('details')
        let titlemodule = document.createElement('summary')
        titlemodule.innerHTML = item.name
        let ullist = document.createElement('ul')

        details.addEventListener('click', async () => {
            let urlModule = `https://course-plataform-backend.onrender.com/modules/${item.id}`

            let module = await fetch(urlModule, {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const response = await module.json()

            ullist.innerHTML = ''

            response.module.video.forEach((video) => {
                let list = document.createElement('li')
                let link = document.createElement('a')

                link.textContent = video.name
                link.href = video.url

                list.appendChild(link)
                ullist.appendChild(list)
            })
        })

        details.appendChild(titlemodule)
        details.appendChild(ullist)
        moduleList.appendChild(details)
    })


}

fillCourseInfo()