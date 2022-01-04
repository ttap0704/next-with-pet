import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableFooter from "@mui/material/TableFooter";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {HiChevronRight, HiChevronLeft} from "react-icons/hi";
import {IconButton, Button} from "@mui/material";
import {useState, useEffect} from "react";

const CustomTable = (props) => {
  const header: {label: string; center: Boolean}[] = props.header;
  const footer_colspan: number = props.footerColspan;
  const max: number = Math.ceil(props.rowsLength / 5);
  const changePerPage: Function = props.changePerPage;
  const [perPage, setPerPage] = useState(1);
  const [btnDisabled, setBtnDisabled] = useState({
    left: false,
    right: false,
  });

  useEffect(() => {
    if (max == 1) {
      setBtnDisabled((state) => {
        return {
          ...state,
          left: true,
          right: true,
        };
      });
    } else {
      setBtnDisabled((state) => {
        return {
          ...state,
          left: true,
          right: false,
        };
      });
    }
  }, [max]);

  function clickDirection(dir: string) {
    let page = 0;
    if (dir == "left") {
      if (perPage == 2) {
        page = 1;
        setBtnDisabled((state) => {
          return {
            ...state,
            left: true,
            right: false,
          };
        });
      } else if (perPage > 2) {
        page = perPage - 1;
        setBtnDisabled((state) => {
          return {
            ...state,
            right: false,
            left: false,
          };
        });
      }
    } else if (dir == "right") {
      if (perPage == max - 1) {
        page = max;
        setBtnDisabled((state) => {
          return {
            ...state,
            left: false,
            right: true,
          };
        });
      } else if (perPage < max) {
        page = perPage + 1;
        setBtnDisabled((state) => {
          return {
            ...state,
            right: false,
            left: false,
          };
        });
      }
    }
    setPerPage(page);
    changePerPage(page);
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="custom table">
        <TableHead>
          <TableRow>
            {header.map((data, index) => {
              return (
                <TableCell align={data.center ? "center" : "left"} key={`custom_table_header_${index}`}>
                  {data.label}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>{props.children}</TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={footer_colspan}>
              <div
                style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}
              >
                <IconButton disabled={btnDisabled.left} onClick={() => clickDirection("left")}>
                  <HiChevronLeft />
                </IconButton>
                <div style={{width: "4rem", textAlign: "center"}}>{`${perPage} / ${max}`}</div>
                <IconButton disabled={btnDisabled.right} onClick={() => clickDirection("right")}>
                  <HiChevronRight />
                </IconButton>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};
export default CustomTable;
