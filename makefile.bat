psql -U dba postgres < ./database/setup.sql
psql -U dba cashpoint < ./database/core_object.sql
psql -U dba cashpoint < ./database/system_user.sql
psql -U dba cashpoint < ./database/product.sql
psql -U dba cashpoint < ./database/sale.sql
psql -U dba cashpoint < ./database/customer.sql
psql -U dba cashpoint < ./database/cash_register.sql
pause