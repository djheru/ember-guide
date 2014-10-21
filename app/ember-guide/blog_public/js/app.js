App = Ember.Application.create();

App.Router.map(function(){
    this.resource('about');
    this.resource('posts', function(){
        this.resource('post', {path: ':post_id'})
    });
    //separate page: this.resource('post', {path: ':post_id'});
});

App.PostsRoute = Ember.Route.extend({
    model: function(){
        //return posts;
        //make an ajax request instead
        return $.getJSON('http://localhost:3000/posts.json')
            .then(function(data){
                data.posts.map(function(post){//do something to the data first
                    post.body = post.content;
                });
                return data.posts;
            });
    }
});

App.PostRoute = Ember.Route.extend({
    model: function(params){
        //return posts.findBy('id', params.post_id);
        //make an ajax request instead
        return $.getJSON('http://localhost:3000/post.json')
            .then(function(data){
                data.post.body = data.post.content;
                console.log(data)
                return data.post;
            });
    }
})

App.PostController = Ember.ObjectController.extend({
    isEditing: false,

    actions: {
        "edit": function(){
            this.set("isEditing", true);
        },
        "doneEditing": function(){
            this.set("isEditing", false);
        }
    }
});

Ember.Handlebars.helper('format-date', function(date){
    return moment(date).fromNow();
});

Ember.Handlebars.helper('format-markdown', function(input){
    return new Handlebars.SafeString(showdown.makeHtml(input));
});

/*
var posts = [
    {
        id: "1",
        title: "Rails is Omakase",
        author: {name: "djehru"},
        date: new Date('10-27-2014'),
        excerpt: "This is the one thing abiut that stuff",
        body: "Foo the things, etc. blah blah blah, lorem ipsum"
    },
    {
        id: "2",
        title: "Blah Blah Blah",
        author: {name: "djehru"},
        date: new Date('10-20-2014'),
        excerpt: "ThKeyboard Kat Meowuff",
        body: "Foasdfasdfo the things, asdfetc. blah blahasdf blah, lorasdfem ipsumasdf"
    }
]*/