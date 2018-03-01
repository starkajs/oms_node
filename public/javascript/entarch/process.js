$(function(){
    let href = location.href;
    let $table = $('#metricsTable').bootstrapTable({
        idField: 'id',
        url: '../../api/entarch/process_metrics/' + href.substr(href.lastIndexOf('/') + 1),
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
            field: 'metric_category',
            title: 'Category',
            filterControl: 'input'
        }, {
            field: 'metric_name',
            title: 'Metric',
            filterControl: 'input',
            formatter: metricNameFormatter
        }, {
            field: 'is_key_performance_indicator',
            title: 'KPI',
            filterControl: 'input',
            formatter: kpiFormatter,
            halign: 'center',
            align: 'center'
        }]
    });
    $table = $('#requirementsTable').bootstrapTable({
        idField: 'id',
        url: '../../api/entarch/process_requirements/' + href.substr(href.lastIndexOf('/') + 1),
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
            field: 'requirement',
            title: 'Requirement',
            filterControl: 'input',
            formatter: requirementFormatter
        }, {
            field: 'is_valid',
            title: 'Valid',
            filterControl: 'input',
            formatter: validFormatter,
            halign: 'center',
            align: 'center'
        }]
    });
})

const metricNameFormatter = (value, row) => {
    return `<a href="/entarch/metric/${row.id}">${value}</a>`
}

const kpiFormatter = (value) => {
    if (value === 1) {
        return 'Yes';
    } else {
        return 'No';
    }
}

const validFormatter = (value) => {
    if (value === 1) {
        return 'Yes';
    } else {
        return 'No';
    }
}

const requirementFormatter = (value, row) => {
    return `<a href="/entarch/requirement/${row.id}">${value}</a>`
}