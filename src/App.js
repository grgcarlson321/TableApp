import React, { Component } from 'react';
import Search from './components/Search';
import TableHeader from './components/TableHeader';
import TableRows from './components/TableRow';
import PageNumbers from './components/PageNumbers';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

class App extends Component {

    constructor(props){
        super(props);

        this.rows = null;

        this.state = {
            result: null,
            rowData: [],
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            sortBy: null,
            sortDir: null,
            currentPage: 1,
            rowsPerPage: 10,
            selected: '',
        };

        this.fetchTableResultsPage = this.fetchTableResultsPage.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.sortRowsBy = this.sortRowsBy.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.renderRows = this.renderRows.bind(this);
        this.isActive = this.isActive.bind(this);
    }

    componentDidMount(){

        const { searchTerm } = this.state;

        this.fetchTableResultsPage(searchTerm);
        // let resultCount = result.length;
        //
        // if(resultCount <= 0){
        //     result = this.rows;
        // }
    }

    setSearchTopStories(result) {

        const { currentPage, rowsPerPage} = this.state;

        // let numberOfHits = newResult.length;
        // let result = newResult;
        //
        // let rowData = [];
        //
        // for(let i = 0; i < rowsPerPage; i++) {
        //     rowData.push(result[i]);
        // }

       // this.setState({result: newResult, rowData: rowData, currentPage: currentPage, rowsPerPage: rowsPerPage});

        this.renderRows(result, currentPage, rowsPerPage);
    }



    fetchTableResultsPage(searchTerm){
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result.hits));
    }

    isActive(number){
        if(number === this.state.currentPage){
            return 'click-state';
        }else{
            return 'base-state';
        }
    }

    renderRows(result, currentPage, rowsPerPage){
        const rowData = [];


        let numberOfHits = result.length;

        let rowIndex = 0;
        let rowEndIndex = 0;

        if(numberOfHits % rowsPerPage === 0){
            rowIndex = (currentPage * rowsPerPage) - rowsPerPage;

            rowEndIndex = rowIndex + rowsPerPage;

            for(let i = rowIndex; i < rowEndIndex; i++){
                rowData.push(result[i]);
            }

        }else{

            rowIndex = (currentPage * rowsPerPage) - rowsPerPage;

            rowEndIndex = rowIndex + rowsPerPage;

            if(rowEndIndex <= numberOfHits){
                for(let i = rowIndex; i < rowEndIndex; i++){
                    rowData.push(result[i]);
            }
            }else{

                let pageRemainder = numberOfHits % rowsPerPage;

                rowEndIndex = rowIndex + pageRemainder;

                for(let i = rowIndex; i < rowEndIndex; i++){
                    rowData.push(result[i]);
                }
            }
        }
        this.setState({result, rowData, numberOfHits, currentPage, rowsPerPage});
        //this.setState({result: result, rowData: currentRows, currentPage: currentPage, rowsPerPage: rowsPerPage});
    }

    handlePageClick(event){
        const { result, rowsPerPage } = this.state;

        this.renderRows(result, Number(event.target.id), rowsPerPage);
    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }

    sortRowsBy(sortBy){

        let { sortDir, result, currentPage, rowsPerPage } = this.state;

        if(sortBy === this.state.sortBy){
            sortDir = this.state.sortDir === 'ASC' ? 'DESC': 'ASC';
        }else{
            sortDir = 'ASC';
        }

        result.sort((a, b) => {
            let sortVal = 0;
            if(a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ){
                sortVal = 1;
            }
            if(a[sortBy].toLowerCase()  < b[sortBy].toLowerCase() ){
                sortVal = -1;
            }
            if(sortDir === 'DESC'){
                sortVal = sortVal * -1;
            }
            return sortVal;
        });

        this.setState({result: result, sortDir: sortDir, sortBy: sortBy});

        this.renderRows(currentPage, rowsPerPage);
    }

    onSearchChange(e){
        e.preventDefault();

        let { result, rowsPerPage } = this.state;

        if(!e.target.value){
            this.setState({ searchTerm: e.target.value });
        }else{
            const filterBy = e.target.value.toString().toLowerCase();

            const filteredList = result.filter(function(fetchData){
                    return (!filterBy ||
                    fetchData.author.toString().toLowerCase().includes(filterBy.toLowerCase()) ||
                    fetchData.title.toString().toLowerCase().includes(filterBy.toLowerCase()));
            });

            let currentRows = [];

            for(let i = 0; i < filteredList.length; i++){
                if(i < rowsPerPage){
                    currentRows.push(filteredList[i]);
                }
            }

            this.setState({rowData: currentRows, result: filteredList, searchTerm: e.target.value});
        }
    }

    onDismiss(id){
        const isNotId = result => result.objectID !== id;
        const updatedHits = this.state.result.filter(isNotId);
        //this.setState({result: updatedHits, rowData: updatedHits});
        this.setSearchTopStories(updatedHits);
    }

    render() {

    const divSearchStyle = { 'marginBottom': '20px' };

    const { searchTerm, rowData, result, numberOfHits, rowsPerPage } = this.state;

    //Logic for displaying page numbers
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(numberOfHits / rowsPerPage); i++){
        pageNumbers.push(i);
    }

    if(!result){
        return null;
    }

    let sortDirArrow = '';

    if (this.state.sortDir !== null){
        sortDirArrow = this.state.sortDir === 'DESC' ? ' ↓' : ' ↑';
    }else{
        sortDirArrow = ' ↓';
    }

    return (
        <div className="App page">
            <div className="interactions">
          <div style={divSearchStyle} >
          <Search
              value={searchTerm}
              onChange={this.onSearchChange}
          >
               <span>Search </span>
          </Search>
              </div>
          <div className="panel panel-default">
              <div className="panel-heading">Table of People</div>
              { rowData &&
                <table className="table">
                  <tbody>
                  <tr>
                  <TableHeader
                      dataKey="row"
                      label="Row"
                      sortRowsBy = {this.sortRowsBy}
                      sortDirArrow = {(this.state.sortBy === 'row' ? sortDirArrow : '')}
                  />
                  <TableHeader
                  dataKey="title"
                  label="Title"
                  sortRowsBy = {this.sortRowsBy}
                  sortDirArrow = {(this.state.sortBy === 'title' ? sortDirArrow : '')}
                  />
                  <TableHeader
                  dataKey="author"
                  label="Author"
                  sortRowsBy={this.sortRowsBy}
                  sortDirArrow={(this.state.sortBy === 'author' ? sortDirArrow : '')}
                  />
                  <TableHeader
                  dataKey="comments"
                  label = "Comments"
                  sortRowsBy = {null}
                  />
                  <TableHeader
                  dataKey="points"
                  label = "Points"
                  sortRowsBy = {null}
                  />
                  <TableHeader
                  dataKey="deleteRow"
                  label = "Delete"
                  sortRowsBy = {null}
                  />
                  </tr>
                  {
                      rowData.map((tableRow, index) =>
                        <TableRows
                              key={tableRow.objectID}
                              index={index}
                              item={tableRow}
                              onDismiss={this.onDismiss}
                          />
                      )
                  }
                  </tbody>
                  </table>
                  }
              </div>
          <ul id="page-numbers">
              {
                  pageNumbers.map(number =>
                  <PageNumbers
                      className={this.isActive(number)}
                      key={number}
                      id={number}
                      handlePageClick={this.handlePageClick}
                  />
                  )
              }
          </ul>
            </div>
        </div>

    );
  }
}


export default App;

