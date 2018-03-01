$(function(){
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../../api/journey/journeys',
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
            field: 'client_name',
            title: 'Client',
            filterControl: 'input',
            formatter: clientNameFormatter
        }, {
            field: 'journey_name',
            title: 'Journey',
            filterControl: 'input',
            formatter: journeyNameFormatter
        }]
    });
})

const clientNameFormatter = (value, row) => {
    return `<a href="/optimum/client/${row.client_id}">${value}</a>`
}

const journeyNameFormatter = (value, row) => {
    return `<a href="/journey/journey/${row.id}">${value}</a>`
}