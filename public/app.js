const {Router, Route, Link} = ReactRouter;

var parameters = [];
var match = []
var questions = [{ name: "genre",
                 blurb: "What genres do you like to read?",
                 values: [
                     {label: "Fantasy", value: "fantasy"},
                     {label: "Romance", value: "romance"},
                     {label: "Horror", value: "horror"},
                     {label: "Action", value: "action"},
                     {label: "Science Fiction", value: "science fiction"},
                     {label: "Comedy", value: "comedy"},
                     {label: "Mystery", value: "mystery"},
                     {label: "Kid Friendly", value: "kid friendly"},
                     {label: "LGBT", value: "lgbt"},
                     {label: "Superhero", value: "superhero"}
                 ]
                }/*,
                { name: "age",
                blurb: "What Age would you like?",
                 values: [
                     {label: "YA", value: "ya"},
                     {label: "pg-13", value: "pg13"},
                     {label: "M", value: "m"},

                 ]
                },*/
              ];
var divStyle = {
  padding: "20px",
  margin: "20px"
}

const App = React.createClass({
  render: function() {
      return (
        <div>
          <Link to="/"><h1 className="text-center">×Comic Rec×</h1></Link>

          <div>
              <Quiz url="/comics"/>
          </div>

          {this.props.children}
        </div>
      );
  }
});

const Quiz = React.createClass({
  getInitialState: function(){
    return {data: [], clicked: false};
  },
  loadComicsFromServer: function(){
    $.ajax({
      url: this.props.url,
      method: "GET",
      data: {"test": "hello"},
      success: function(result) {
        console.log("Result: ", result);
        this.setState({data: result});
      }.bind(this)
    });

  },
  ComponentDidMount: function() {
    this.loadComicsFromServer();
  },
  handleSurveySubmit: function(survey) {
    this.setState({clicked: true});
    console.log("clicked!")
    /* Todo: submit to the server and refresh/filter the comics list */
  },
  render: function(){
      return (
        <div>
          <SurveyApp questions={questions} handleSurveySubmit={this.handleSurveySubmit}/>
        </div>

      )
  }
});

var CheckboxInput = React.createClass({
  render: function () {
    return (
      <div className="checkbox">
          <label>
              <input type="checkbox"
                name={this.props.name}
                checked={this.props.checked}
                onClick={this.handleChange}
                value={this.props.value} />
                {this.props.label}
        </label>
      </div>
    );
  },
  handleChange: function(e) {
      // Just a little preprocessing before passing upwards
      this.props.handleChange(this.props.index, e.target.checked);
  }
});

var CheckboxInputField = React.createClass({
    render: function() {
        var name = this.props.question.name;
        var that = this;
        var x = -1;
        var mappedInputElements = this.props.question.values.map(function(data, key) {
            x++;
            return (
              <CheckboxInput
                name={name}
                label={data.label}
                index={x}
                key={data.value}
                value={data.value}
                handleChange={that.handleFieldChange} />
            );
        });
        return (
            <div className="inputFieldWrapper">
                <p>{this.props.question.blurb}</p>
                {mappedInputElements}
            </div>
        );
    },
    handleFieldChange: function(elementIndex, elementChecked) {
        // A little more pre-processing, then pass the data upwards again
         this.props.handleFieldChange(this.props.index, elementIndex, elementChecked);

    }
});

var CheckboxInputFields = React.createClass({
    render: function() {
        var that = this;
        var x = -1;
        var mappedInputFields = this.props.questions.map(function(question, key) {
            x++;
            return (
              <CheckboxInputField
                question={question}
                index={x}
                key = {question.name}
                handleFieldChange={that.props.handleFieldChange} />
            );
        });
        return (
            <div>
                {mappedInputFields}
            </div>
        );
    }
});

var SurveyApp = React.createClass({
    getInitialState: function() {
        var questions = this.props.questions.slice();
        return {questions: questions, parameters: [], clicked: false};
    },
    handleFieldChange: function(questionIndex, elementIndex, checked) {
        // Update the state data.  If the element has been checked, then change the element's
        // corresponding data point's checked property to true.  (This will add the checked
        // property to that data point if it doesn't already exist.)  If the element has been
        // unchecked, then we'll delete that data point's checked element it it exists.

        var newStateQuestions = this.state.questions.slice();
        var elementCheckToUpdate = newStateQuestions[questionIndex].values[elementIndex];
        if(checked) {
            elementCheckToUpdate.checked = true
            parameters.push(elementCheckToUpdate.value);
            var indexPushed = parameters.indexOf(elementCheckToUpdate)
        }
        else {
            if(typeof elementCheckToUpdate.checked !== undefined) {
              var indexUncheck = parameters.indexOf(elementCheckToUpdate.value)
              parameters.splice(indexUncheck, 1);
              delete elementCheckToUpdate.checked;
            }
        }
        this.setState({questions: newStateQuestions});
        this.setState({parameters: parameters});
    },

    handleSubmit: function(event) {
      event.preventDefault();
      this.setState({clicked: true});
      console.log("User submitted: ", parameters)
    },
    render: function() {
        console.log("Current state params: ",this.state.parameters)
        console.log("Currently, clicked is: ",this.state.clicked)
        var content;
        if (this.state.clicked) {
          content =  <ComicsList query={this.state.parameters}/>
        } else {
          content =
          <div className="container">
                <form action="" onSubmit={this.handleSubmit}>
                  <CheckboxInputFields
                    questions={this.state.questions}
                    handleFieldChange={this.handleFieldChange}
                    parameters={this.state.parameters} />
                  <br></br>
                  <input className="btn btn-default" type="submit"></input>
                </form>
                </div>
        }
        return (
          <div>
            {content}
          </div>
        )
    }
});

const ComicsList = React.createClass({
  getInitialState: function(){
    return {data: []};
  },

  componentDidMount: function() {
    $.ajax({
      url: "/comics",
      method: "GET",
      data: {"test": this.props.query},
      success: function(result) {
        console.log("Result: ", result);
        this.setState({data: result});
      }.bind(this)
    });
  },

  render: function() {
    var comicNodes = this.state.data.map(function(comic){
      return <Comic info={comic}/>;
    });
    return (
      <div>
        <h2>Here are my suggestions ↯:</h2>
            {comicNodes}
      </div>
    );
  }
});

/* Each Comic represents each element in the filtered ComicsList*/
const Comic = React.createClass({
  render: function() {
    var titleParam = this.props.info.name.replace(/\s/g, '+');
    let comicPath = '/ComicsList/'+titleParam;

    return (
      <div className="col-md-6">
        <Link to={comicPath}>
          <ComicPreview title={this.props.info.name} url={comicPath}/>
        </Link>
      </div>
    )
  }
});

var divStyleBox = {
  "height": "600px",
  "margin" : "10px"
}

var imgPreview = {
}

const ComicPreview = React.createClass({
  getInitialState: function() {
    return {comic: null, id: null};
  },

  loadComicData: function() {
      $.ajax({
        url: '/comic',
        method: 'GET',
        data: {"title": this.props.title},
        success: function(result) {
          console.log("Ajax Request for ID: ", result);
          this.setState({id: result});
          console.log("LoadComicID State: ",this.state.id)
          $.ajax({
            url: result+'?api_key=5274bd58ebf48aedf46d7a1aa08c6ee8b9127c3f&format=jsonp&json_callback=?',
            method: 'GET',
            dataType: 'jsonp',
            success: function(result) {
                  this.setState({comic: result});
                  console.log("Successful 2nd Ajax!",result);
              }.bind(this)
          })
        }.bind(this)
      })
  },

  componentDidMount: function() {
      this.loadComicData()
  },

  render: function() {
    var content = this.state.id && this.state.comic ?
          <div style = {divStyleBox}>
            <img style={imgPreview} className="img-responsive center block" src={"http://static.comicvine.com" + this.state.comic.results.image.small_url}></img>
          </div>
    : <h2>"Sorry!"</h2>;
    return (
      <div className="container">
        {content}
      </div>
    );
}
});
/* Show selected Comic component's detailed info */
const ComicInfo = React.createClass({

  getInitialState: function() {
    return {comic: null, id: null};
  },

  loadComicData: function() {
      $.ajax({
        url: '/comic',
        method: 'GET',
        data: {"title": this.props.params.title},
        success: function(result) {
          console.log("Ajax Request for ID: ", result);
          this.setState({id: result});
          console.log("LoadComicID State: ",this.state.id)
          $.ajax({
            url: result+'?api_key=5274bd58ebf48aedf46d7a1aa08c6ee8b9127c3f&format=jsonp&json_callback=?',
            method: 'GET',
            dataType: 'jsonp',
            success: function(result) {
                  this.setState({comic: result});
                  console.log("Successful 2nd Ajax!",result);
              }.bind(this)
          })
        }.bind(this)
      })
  },

  componentDidMount: function() {
      this.loadComicData()
  },

  render: function() {
    var content = this.state.id && this.state.comic ?
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-6">
            <img className="img-responsive" src={"http://static.comicvine.com" + this.state.comic.results.image.medium_url}></img>
          </div>
          <div className="col-xs-6">
            <p>{$(this.state.comic.results.description).text().substring(0,1000)}<a href="#">...Read More</a></p>
          </div>
        </div>
      </div> : <h2>"Sorry!"</h2>;
        return (
          <div className="container">
            {content}
          </div>
        );
  }
}); /* Comic Info Detail Ends */

React.render((
  <Router>
    <Route path="/" component={App}>
        <Route path="/Quiz" component={Quiz}></Route>
        <Route path="/ComicsList/:title" component={ComicInfo}>
        </Route>
        <Route path="/ComicsList" component={ComicsList}>
        </Route>
    </Route>
  </Router>
), document.body);
