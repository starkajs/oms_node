$(function(){
    let href = location.href;
    let $table = $('#requirementsTable').bootstrapTable({
        idField: 'id',
        url: '../../api/journey/journey_requirements/' + href.substr(href.lastIndexOf('/') + 1),
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
            field: 'requirement',
            title: 'Requirement',
            filterControl: 'input',
            formatter: requirementNameFormatter
        }, {
            field: 'is_key_requirement',
            title: 'Key Requirement',
            filterControl: 'input',
            formatter: keyRequirementFormatter
        }]
    });
})

const requirementNameFormatter = (value, row) => {
    return `<a href="/journey/solution/${row.id}">${value}</a>`
}

const keyRequirementFormatter = (value, row) => {
    if (value == 1) {
        return 'Yes';
    } else {
        return 'No';
    }
}