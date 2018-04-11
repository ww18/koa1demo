var koa = require('koa');
var rp = require('request-promise');
var router = require('koa-router')();
var app = koa();


app.use(function *(next){
	var start = new Date();
	console.log('顺序1');
	yield next;
	var ms = new Date - start;
	console.log('顺序6');
	this.set('X-Response-Time', ms + 'ms');
})

app.use(function *(next){
	var start = new Date();
	console.log('顺序2');
	yield next;
	var ms = new Date - start;
	console.log('顺序5');
	console.log('$s $s - $s', this.method, this.url, ms);
})

app.use(function *(next){
	console.log('顺序3');
	yield next;
	//this.body = 'Hello world';
	//console.log('顺序6');
})

router.get('/', function *(next){
	console.log('顺序4');
	this.body = 'Hello world';
});

const asyncOperation = ()=>
new Promise((resolve, reject)=>
	rp('http://www.baidu.com')
	.then(function(htmlString){
		resolve(htmlString);
	})
	.catch(function(err){
		reject('error');
	})
	)
router.get('/promise', function *(){
	this.body = yield asyncOperation();

})
app.use(router.routes(),router.allowedMethods());
app.listen('3000');