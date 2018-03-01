$(function(){
    let href = location.href;
    let $table = $('#scenariosTable').bootstrapTable({
        idField: 'id',
        url: '../../api/journey/journey_scenarios/' + href.substr(href.lastIndexOf('/') + 1),
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        height: 350,
        columns: [{
            field: 'id',
            title: 'ID',
            visible: false
        },{
            field: 'scenario_name',
            title: 'Scenario',
            filterControl: 'input',
            formatter: scenarioNameFormatter
        }]
    });
})

const scenarioNameFormatter = (value, row) => {
    return `<a href="/journey/solution/${row.id}">${value}</a>`
}
