$(function(){
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../api/admin/industries',
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        height: 700,
        columns: [{
            field: 'id',
            title: 'ID',
            filterControl: 'input'
        }, {
            field: 'classification_type',
            title: 'Type',
            filterControl: 'input'
        }, {
            field: 'classification_name',
            title: 'Name',
            filterControl: 'input'
        }, {
            field: 'classification_description',
            title: 'Description'
        }]
    });
})
