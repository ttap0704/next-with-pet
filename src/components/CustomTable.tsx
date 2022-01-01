import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



const CustomTable = (props) => {
  const header = props.header;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="custom table">
        <TableHead>
          <TableRow>
            {
              header.map((data, index) => {
                return (
                  <TableCell key={`custom_table_header_${index}`}>{data}</TableCell>
                )
              })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {props.children}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default CustomTable;