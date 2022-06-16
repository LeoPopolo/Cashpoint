
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

async createReportExcel() {

	if (this.isOperator)
		await this.getBillingReportForOperator();
	else
		await this.getBillingReport();

	if (this.reportList) {

		let tmp_obj = [];

		for (let item of this.reportList.payments) {
			tmp_obj.push({
				date: item.date,
				time: item.time,
				amount: item.amount.toFixed(2),
				name: item.cardholder_name,
				email: item.customer.email,
				customer_id: item.customer.id,
				status: this.parsePaymentStatus(item.status),
				installments: item.installments,
				card_brand: item.card_brand,
				card_type: item.card_type
			});
		}

		let workbook = new Workbook();
		let worksheet = workbook.addWorksheet("Reporte de facturación - Moi");
		let header = ["Fecha", "Hora", "Monto", "Nombre", "E-mail", "DNI", "Estado", "Cuotas", "Tarjeta", "Tipo de tarjeta"]

		worksheet.addRow(["Entidad: " + this.reportList.entity.name]);
		worksheet.addRow(["CUIT: " + this.reportList.entity.cuit]);
		worksheet.addRow([]);
		worksheet.addRow(["Total: $" + this.reportList.total.toFixed(2)]);
		worksheet.addRow(["% de comisión: " + this.reportList.comission + "%"]);
		worksheet.addRow(["Comisión total: $" + this.reportList.total_comission.toFixed(2)]);
		worksheet.addRow([]);
		worksheet.addRow(header);

		for (let x1 of tmp_obj) {
			let x2 = Object.keys(x1);
			let temp = []
			for (let y of x2) {
				temp.push(x1[y])
			}
			worksheet.addRow(temp)
		}

		let fname = this.reportList.entity.name + " " + this.jsonDate.month + "-" + this.jsonDate.year;

		const today = Date.now();
		const date = new Date(today);

		worksheet.pageSetup.horizontalCentered = true;
		worksheet.pageSetup.verticalCentered = true;

		worksheet.columns[0].width = 25;
		worksheet.columns[3].width = 25;
		worksheet.columns[4].width = 20;
		worksheet.columns[5].width = 15;
		worksheet.columns[2].alignment = {
			horizontal: 'left'
		};
		worksheet.columns[6].alignment = {
			horizontal: 'left'
		};

		workbook.xlsx.writeBuffer().then((data) => {
			let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
			fs.saveAs(blob, fname + ' - ' + date.toDateString().valueOf() + '.xlsx');
		});
	}

}