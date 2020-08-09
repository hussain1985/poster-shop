
var LOAD_NUM =4;
var watcher;
setTimeout(function(){
    new Vue({
        el: "#app",
        data:{
            total: 0,
            products: [],
            cart: [],
            search: 'cat',
            lastSearch: '',
            loading: false,
            results: []
    
        },
        methods: {
            addToCart(product){
                this.total += product.price;
                var found = false;
                for(let i =0; i<this.cart.length; i++){
                    if(this.cart[i].id === product.id){
                        this.cart[i].qty++;
                        found=true;
                    }
                }
                if(!found){
                    this.cart.push({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        qty: 1
                    });
                }
             
            },
            appendResults(){
                if(this.products.length < this.results.length){
                    var toAppend  = this.results.slice(this.products.length, LOAD_NUM+this.products.length);
                    this.products = this.products.concat(toAppend);
                }
            },
            inc(item){
                this.total+=item.price;
                item.qty++;
            },
            dec(item){
                this.total-=item.price;
                item.qty--;
                if(item.qty<=0){
                    var i = this.cart.indexOf(item);
                    this.cart.splice(i,1);
                }
            },
            onSubmit(){
                this.products = [];
                this.results = [];
                this.loading = true;
                const path = "/search?q=".concat(this.search);
                this.$http.get(path)
                .then(function(response){
                    this.results = response.body;
                    this.appendResults();
                    this.lastSearch = this.search;
                    this.loading = false;
                })
            }   
        },
        created(){
            this.onSubmit();
        },
        updated(){
            console.log("upadted")
            var sensor = document.querySelector("#product-list-bottom");
            watcher = scrollMonitor.create(sensor);
            watcher.enterViewport(this.appendResults);
        },
        beforeUpdate(){
            console.log("before updated")
            if(watcher){
                watcher.destroy();
                watcher = null;
            }
        },
    
        filters: {
            currency: function(price){
                return "$".concat(price.toFixed(2));
            }
        }
    })
},3000)





// window.onscroll = function(ev) {
//     // console.log("height ", document.body.offsetHeight)
//     // console.log("window innerheight ", window.innerHeight)
//     // console.log("window page y offset ", window.pageYOffset)
//     if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
//         console.log("you're at the bottom of the page");
//     }
// };

