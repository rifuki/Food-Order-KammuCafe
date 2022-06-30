import { Button, Container, Table } from "react-bootstrap";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import {
  HeaderCustomerComponent,
  NavbarCustomerComponent,
} from "../../components/customer";

const UserProfile = () => {
  const customer = JSON.parse(localStorage.getItem("customerData"));
  const navigate = useNavigate();
  const logOut = () => {
    swal({
      title: "Anda Yakin Keluar?",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          localStorage.clear();
          navigate("/");
        } catch (error) {
          console.log(error.message);
        }
      }
    });
  };
  return (
    <div className="bg-dark text-white" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <HeaderCustomerComponent />
      {/* End Header */}

      <Container>
        <Table className="mt-2 table-borderless text-white table-dark align-middle">
          <tbody>
            <tr>
              <td>ID Pelanggan</td>
              <td className="text-break">{customer._id}</td>
            </tr>
            <tr>
              <td>Nama Pelanggan</td>
              <td>{customer.nama}</td>
            </tr>
            <tr>
              <td>No Meja</td>
              <td>{customer.no_meja}</td>
            </tr>
          </tbody>
        </Table>
        <Button className="btn btn-danger w-100" onClick={() => logOut()}>
          Log Out
        </Button>
      </Container>
      <NavbarCustomerComponent />
    </div>
  );
};

export default UserProfile;
