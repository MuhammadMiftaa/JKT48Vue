var app = new Vue({
    el: '#app',
    data: {
        fullData: null,
        dataMember: null,
        style: {
            modeStatus: true,
            index: 0
        },
    },
    mounted: async function () {
        try {
            const response = await axios.get('biodata.json');
            this.dataMember = response.data.data;
            this.fullData = response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            alert(error.message);
        }
    },
    filters: {
        formatAge: function (val) {
            return val + " years old"
        },
    },
    methods: {
        shouldDisplayMember(member) {
            const normalize = str => str.toLowerCase();
            return (
                (normalize(member.nama) == normalize(this.fullData.searchByName) || this.fullData.searchByName === '') &&
                (normalize(member.umur.toString()) == normalize(this.fullData.searchByAge) || this.fullData.searchByAge === '') &&
                (normalize(member.generasi) == normalize(this.fullData.searchByGeneration) || this.fullData.searchByGeneration === '') &&
                (normalize(member.asal) == normalize(this.fullData.searchByOrigin) || this.fullData.searchByOrigin === '') &&
                (normalize(member.universitas) == normalize(this.fullData.searchByUniversity) || this.fullData.searchByUniversity === '')
            );
        },
        isEmptySearch() {
            return Object.values(this.fullData).every(value => value === '');
        },
        clearSearch() {
            this.fullData.searchByName = ''
            this.fullData.searchByAge = ''
            this.fullData.searchByGeneration = ''
            this.fullData.searchByOrigin = ''
            this.fullData.searchByUniversity = ''
            document.getElementById('Fullname').value = ''
            document.getElementById('Age').value = ''
            document.getElementById('Generation').value = ''
            document.getElementById('Origin').value = ''
            document.getElementById('University').value = ''
        },
        before: function (el) {
            el.className = 'd-none';
        },
        enter: function (el) {
            var delay = el.dataset.index * 50
            setTimeout(() => {
                el.className = 'card d-flex animate__animated animate__fadeInUpBig'
                window.scrollTo(0, 0);
            }, delay);
        },
        leave: function (el) {
            var delay = el.dataset.index * 50
            setTimeout(() => {
                el.className = 'card d-flex animate__animated animate__fadeOutUpBig'
                window.scrollTo(0, 0);
            }, delay);
        },
        sendIndex: function (index) {
            this.style.index = index
        }
    },
    computed: {
        switchBgMode() {
            return this.style.modeStatus ? 'bg-dark' : 'bg-light'
        },
        switchTextMode() {
            return this.style.modeStatus ? 'text-light' : 'text-dark'
        },
        switchNavMode() {
            return this.style.modeStatus ? 'navbar-dark' : 'navbar-light'
        }
    }
});

Vue.component('generation', {
    props: ['generation'],
    methods: {
        formatGen: function (val) {
            if (val % 100 >= 11 && val % 100 <= 13) {
                return val + "th Generation";
            } else {
                switch (val % 10) {
                    case 1:
                        return val + "st Generation";
                    case 2:
                        return val + "nd Generation";
                    case 3:
                        return val + "rd Generation";
                    default:
                        return val + "th Generation";
                }
            }
        }
    },
    template: `
    <h3 class="card-text fs-5 fw-normal fst-italic text-body-emphasis float-start">{{ formatGen(generation) }}</h3>
    `
})

Vue.component('search-form', {
    props: ['placeholder', 'label'],
    template: `
    <div>
        <h4 class="fw-light">{{ label }}</h4>
        <form class="d-flex mt-3 mb-3 form-floating" role="search">
            <input class="form-control me-2" id="floatingInput" :id="label" type="text"
                :placeholder="placeholder" @input="$emit('input', $event.target.value)">
            <label class="text-dark" for="floatingInput">{{placeholder}}</label>
        </form>
    </div>
    `
})

Vue.component('modal', {
    props: {
        indexMember: {
            type: Number,
            default: 0
        },
        dataMember: {
            type: Array,
            default: function(){return []}
        }
    },
    template:`
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fw-bold fs-4" id="exampleModalLabel">{{ dataMember(indexMember).nama }}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body d-flex gap-5 ">
                        <img :src="dataMember(indexMember).foto" alt="" class="rounded-3">
                        <div class="d-flex flex-column justify-content-evenly w-50">
                            <h2 class="fs-4 fst-italic fw-bold text-dark"><span class="fw-light text-body-secondary">Fullname: </span>{{dataMember(indexMember).nama}}</h2>
                            <div class="d-flex justify-content-between">
                                <h2 class="fs-4 fst-italic fw-bold text-dark"><span class="fw-light text-body-secondary">Date of Birth: </span>{{dataMember(indexMember).tanggal_lahir}}</h2>
                                <h2 class="fs-4 fst-italic fw-bold text-dark"><span class="fw-light text-body-secondary">Age: </span>{{dataMember(indexMember).umur}}</h2>
                            </div>
                            <h2 class="fs-4 fst-italic fw-bold text-dark"><span class="fw-light text-body-secondary">City of Origin: </span>{{dataMember(indexMember).asal}}</h2>
                            <h2 class="fs-4 fst-italic fw-bold text-dark"><span class="fw-light text-body-secondary">Generation: </span>{{dataMember(indexMember).generasi}}</h2>
                            <div class="d-flex justify-content-between gap-3">
                                <h2 class="fs-4 fst-italic fw-bold text-dark d-flex flex-column"><span class="fw-light text-body-secondary">University: </span>{{dataMember(indexMember).universitas}}</h2>
                                <h2 class="fs-4 fst-italic fw-bold text-dark d-flex flex-column"><span class="fw-light text-body-secondary">Major: </span>{{dataMember(indexMember).jurusan}}</h2>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `
})