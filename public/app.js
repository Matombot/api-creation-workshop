let seasonFilter = 'All';
let genderFilter = 'All';

const seasonOptions = document.querySelector('.seasons');
const genderOptions = document.querySelector('.genders');
const searchResultsElem = document.querySelector('.searchResults');
const priceRangeElem = document.querySelector('.priceRange');
const showPriceRangeElem = document.querySelector('.showPriceRange');
const loginBtn = document.querySelector('.loginBtn');
const loginElem = document.querySelector('.login')
const username = document.querySelector('.username')


const garmentsTemplateText = document.querySelector('.garmentListTemplate');
const garmentsTemplate = Handlebars.compile(garmentsTemplateText.innerHTML);

seasonOptions.addEventListener('click', function(evt){
	seasonFilter = evt.target.value;
	filterData();
});

genderOptions.addEventListener('click', function(evt){
	genderFilter = evt.target.value;
	filterData();
});

function filterData() {
	axios
		.get(`/api/garments?gender=${genderFilter}&season=${seasonFilter}`)
		.then(function(result) {
			searchResultsElem.innerHTML = garmentsTemplate({
				garments : result.data.garments
			})
		});
}

priceRangeElem.addEventListener('change', function(evt){
	const maxPrice = evt.target.value;
	showPriceRangeElem.innerHTML = maxPrice;
	axios
		.get(`/api/garments/price/${maxPrice}`)
		.then(function(result) {
			searchResultsElem.innerHTML = garmentsTemplate({
				garments : result.data.garments
			})
		});
		
});

 
const login = () =>{

}
// if(localStorage.getItem('token')){
//     login.classList.add('hidden');
// }

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

loginBtn.addEventListener('click' , function(){
    if(username.value){
        axios
        .post('/api/token/' ,{username :username.value})
        .then(function(result){
            const {token} = result.data;
            //update Axios's latest token
            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
			filterData();
        });
		
    }
	
});
filterData();
// .catch((err) => {
// 			loginElem.innerHTML += `<div style = "color:red"> ACESS DENIED <div>`;
// 		});