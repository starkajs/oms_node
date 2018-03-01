$(function(){
    let href = location.href;
    let $table = $('#capabilitiesTable').bootstrapTable({
        idField: 'id',
        url: '../../api/journey/journey_capabilities/' + href.substr(href.lastIndexOf('/') + 1),
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        height: 350,
        columns: [{
            field: 'capability_id',
            title: 'ID',
            visible: false
        },{
            field: 'capability_name',
            title: 'Capability',
            filterControl: 'input',
            formatter: capabilityNameFormatter
        }, {
            field: 'is_in_scope',
            title: 'Scope',
            formatter: scopeFormatter,
            halign: 'center',
            align: 'center',
            filterControl: 'input',
            visible: false
        }]
    });
})

const capabilityNameFormatter = (value, row) => {
    if (row.is_in_scope == 1) {
        return `<a class="text-success" href="/journey/capability/${row.capability_id}">${value}</a>`
    } else {
        return `<a href="/journey/capability/${row.capability_id}">${value}</a>`
    }

}

const scopeFormatter = (value, row) => {
    if (value == 0) {
        // not in scope
        return `<a>In</a>`
    } else {
        // in scope
        return `<a>Out</a>`
    }

}
