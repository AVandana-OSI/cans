import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import './style.sass'

const PageModal = ({
  title,
  warningDescription,
  description,
  onCancel,
  onRemove,
  cancelButtonLabel,
  removeButtonLabel,
  isOpen,
}) => (
  <Modal className="warning-modal" isOpen={isOpen}>
    <ModalBody className="warning-modal-body">
      <div className="warning-modal-exclamation-triangle">
        <i className="fa fa-exclamation-triangle" />
      </div>
      <div className="warning-modal-heading">{title}</div>
      <div>{warningDescription}</div>
      <div>{description}</div>
    </ModalBody>
    <ModalFooter className="warning-modal-footer">
      <Button className="warning-modal-logout" onClick={onCancel}>
        {cancelButtonLabel}
      </Button>{' '}
      <Button className="warning-modal-stay-logged-in" onClick={onRemove}>
        {removeButtonLabel}
      </Button>
    </ModalFooter>
  </Modal>
)

PageModal.propTypes = {
  cancelButtonLabel: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  removeButtonLabel: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  warningDescription: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
}

PageModal.defaultProps = {
  isOpen: true,
}
export default PageModal
