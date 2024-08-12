import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function Confirm(onConfirm) {
  return confirmAlert(
    {
        title : 'Confirm Logout',
        message : 'Are you sure you want to log out?',
        buttons : [
            {
                label : 'Yes',
                onClick : onConfirm
            },
            {
                label : 'No'
            }
        ]
    }
  );
}

export default Confirm;