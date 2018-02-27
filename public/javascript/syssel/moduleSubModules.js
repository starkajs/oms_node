$(function(){
    let href = location.href;
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../../api/syssel/submodules/' + href.substr(href.lastIndexOf('/') + 1),
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        sortable: true,
        height: 600,
        columns: [{
            field: 'id',
            title: 'ID',
            visible: false
        }, {
            field: 'delete',
            title: 'Delete',
            formatter: moduleDeleteFormatter,
            halign: 'center',
            align: 'center'
        },{
            field: 'sub_module_name',
            title: 'Name',
            filterControl: 'input',
            formatter: moduleNameFormatter,
            sortable: true
        }, {
            field: 'sub_module_description',
            title: 'Description',
            filterControl: 'input',
            visible: false
        }, {
            field: 'system_count',
            title: 'Systems',
            sortable: true,
            halign: 'center',
            align: 'center'
        }]
    });
})


const moduleNameFormatter = function(value, row){
    return '<a href="/syssel/submodule/' + row.id + '">' + value + '</a>';
};

const moduleDeleteFormatter = function(value, row){
    let href = location.href;
    return '<a href="/api/syssel/delete_sub_module/' + href.substr(href.lastIndexOf('/') + 1) + '/' + row.id + '"><span class="glyphicon glyphicon-trash"></span></a>';
}
