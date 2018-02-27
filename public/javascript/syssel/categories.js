$(function(){
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../api/syssel/categories',
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        sortable: true,
        height: 700,
        columns: [{
            field: 'id',
            title: 'ID',
            visible: false
        }, {
            field: 'delete',
            title: 'Delete',
            formatter: categoryDeleteFormatter,
            halign: 'center',
            align: 'center'
        },{
            field: 'category_name',
            title: 'Name',
            filterControl: 'input',
            formatter: categoryNameFormatter,
            sortable: true
        }, {
            field: 'category_description',
            title: 'Description',
            filterControl: 'input'
        }, {
            field: 'system_count',
            title: 'Systems',
            sortable: true,
            halign: 'center',
            align: 'center'
        }]
    });
})


const categoryNameFormatter = function(value, row){
    return '<a href="/syssel/category/' + row.id + '">' + value + '</a>';
};

const categoryDeleteFormatter = function(value, row){
    return '<a href="/syssel/delete_category/' + row.id + '"><span class="glyphicon glyphicon-trash"></span></a>';
}
