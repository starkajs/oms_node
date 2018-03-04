$(function(){
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../../api/journey/categories',
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
            visible: false
        },{
            field: 'category_name',
            title: 'Category',
            formatter: categoryNameFormatter
        }, {
            field: 'category_description',
            title: 'Description'
        }, {
            field: 'question_count',
            title: 'Questions',
            formatter: questionFormatter,
            halign: 'center',
            align: 'center'
        }]
    });
})

const categoryNameFormatter = (value, row) => {
    return `<a href="/journey/category/${row.id}">${value}</a>`
}

const questionFormatter = (value, row) => {
    return `<a href="/journey/questions/${row.id}">${value}</a>`
}
