import { useEffect, useState } from 'react';
import styles from './ManageTickets.module.css';
import Slider from '../../../../../components/SliderButton/Slider';
import TicketBox from './components/TicketBox/TicketBox';
import { TbSettings } from 'react-icons/tb';
import { EventType, TicketType } from '../../../../../apis/types';
import { editTicket, createTicket, deleteTicket, getTickets } from '../../../../../apis/tickets';
import Modal from '../../../../../components/Modal/Modal';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HashLoader } from 'react-spinners';
import { isEqual } from 'lodash';

const ManageTickets = () => {
  const { event_id: eventId } = JSON.parse(sessionStorage.getItem('eventData') || '');
  const [ticketData, setTicketData] = useState<TicketType[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketType>();
  const [isOpen, setIsOpen] = useState(false);
  const [isChangedModal, setIsChangedModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [settingNewTicket, setSettingNewTicket] = useState(false);
  const [ticketPair, setTicketPair] = useState<TicketType[]>();
  const getDeepCopy = (obj: any) => JSON.parse(JSON.stringify(obj));

  const onNewTicket = () => {
    if (settingNewTicket) {
      toast.error('Please save changes before adding new ticket');
      return;
    }
    setSettingNewTicket(true);
    const newTicket: TicketType = {
      ...(getDeepCopy(tickets.find((t) => t.default_selected == true)) as TicketType),
      new: true,
      title: 'New Ticket',
      description: '',
      id: '',
      default_selected: false,
      // approval_required: false,
      // price: 0,
      // perks: undefined,
      // registration_count: 0,
      // capacity: 0,
      // default_selected: false,
      // platform_fee: 0,
      // platform_fee_from_user: false,
      // currency: '',
      // entry_date: [],
      // code_prefix: '',
      // code_digits: 0,
      // maintain_code_order: false,
      // is_active: true,
    };
    setTickets((prevTickets) => [newTicket, ...prevTickets]);
  };

  const addTicket = async () => {
    if (settingNewTicket && tickets[0]?.new === true) {
      const newTicketId = await createTicket(eventId, selectedTicket as TicketType);
      if (newTicketId) {
        setTicketData((prevTickets) => [
          { ...(selectedTicket as TicketType), id: newTicketId },
          ...prevTickets,
        ]);
        setSettingNewTicket(false);
        setSelectedTicket(undefined);
      }
    }
  };

  const onDeleteTicket = () => {
    if (selectedTicket && selectedTicket.new == true) {
      setTickets((prevTickets) => prevTickets.filter((t) => t.new != true));
      setSettingNewTicket(false);
      toast.success('Ticket deleted successfully');
      setSelectedTicket(undefined);
      return;
    }

    if (selectedTicket) {
      deleteTicket(eventId, selectedTicket.id, setTicketData);
      setSelectedTicket(undefined);
    }
  };

  const updateTicket = () => {
    const matchingTicket = ticketData.find((ticket) => ticket.id === selectedTicket?.id);
    if (matchingTicket) {
      const changedData: Record<string, any> = Object.entries(selectedTicket as Record<string, any>)
        .filter(([key, value]) => matchingTicket?.[key as keyof EventType] !== value)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

      if (changedData?.description == '' && matchingTicket?.description == null)
        delete changedData['description'];

      editTicket(eventId, selectedTicket as TicketType, changedData, setTicketData);
    }
  };

  const checkUnsavedChanges = () => {
    console.log(
      selectedTicket as TicketType,
      ticketData?.find((t) => t.id === selectedTicket?.id),
    );
    return !isEqual(
      selectedTicket,
      ticketData?.find((t) => t.id === selectedTicket?.id),
    );
  };

  const changeDefaultSelected = (ticketId: string) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, default_selected: true }
          : { ...ticket, default_selected: false },
      ),
    );
    setSelectedTicket({
      ...tickets.find((t) => t.id === ticketId),
      default_selected: true,
    } as TicketType);
  };

  useEffect(() => {
    if (eventId && !ticketData.length) getTickets(eventId, setTicketData);
  }, [eventId, ticketData]);

  useEffect(() => {
    if (settingNewTicket) {
      setSelectedTicket(tickets[0]);
    }
  }, [tickets.length]);

  useEffect(() => {
    setTickets(ticketData || []);
    ticketData?.forEach((ticket) => {
      if (ticket.default_selected) setSelectedTicket(ticket);
    });
  }, [ticketData]);

  useEffect(() => {
    console.log(tickets);
  }, [tickets]);

  return (
    <>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)} style={{ zIndex: 999 }}>
          <h3 className={styles.modalTitle}>Advanced Setting</h3>
          <div className={styles.advancedOptions}>
            <label className={styles.optionLabel}>Code Prefix</label>
            <input
              className={styles.optionInput}
              placeholder='Eg, PS123'
              value={selectedTicket?.code_prefix}
              onChange={(e) =>
                setSelectedTicket({ ...selectedTicket, code_prefix: e.target.value } as TicketType)
              }
            />
          </div>

          <div className={styles.advancedOptions}>
            <label className={styles.optionLabel}>No of digits</label>
            <input
              className={styles.optionInput}
              placeholder=''
              value={selectedTicket?.code_digits}
              onChange={(e) =>
                setSelectedTicket({
                  ...selectedTicket,
                  code_digits: Number(e.target.value),
                } as TicketType)
              }
            />
          </div>
          <div className={styles.modalTicketOption}>
            <div className={styles.modalTicketSliderLabel}>
              <p className={styles.ticketSliderLabel}>Maintain Order</p>
              <p className={styles.ticketSliderSubLabel}>The tickets will be generated in order</p>
            </div>

            <Slider
              checked={selectedTicket?.maintain_code_order as boolean}
              onChange={() => {
                setSelectedTicket({
                  ...selectedTicket,
                  maintain_code_order: !selectedTicket?.maintain_code_order,
                } as TicketType);
              }}
            />
          </div>
          <button className={styles.cancelButton} onClick={() => setIsOpen(false)}>
            Back
          </button>
        </Modal>
      )}
      {isChangedModal && (
        <Modal onClose={() => setIsChangedModal(false)} style={{ zIndex: 999 }}>
          <div className={styles.modalContainer}>
            {/* Get Confirmation to continue event though user has not saved changes.*/}
            <div className={styles.sectionContent1}>
              <p className={styles.sectionTitle}>You have unsaved changes</p>
              <p className={styles.sectionSubTitle}>
                Are you sure you want to continue without saving?
              </p>
            </div>
            <div className={styles.modalButtons}>
              <button
                className={styles.confirmButton}
                onClick={() => {
                  setIsChangedModal(false);
                  const [tempTicket, tempSelectedTicket] = ticketPair as TicketType[];
                  changeDefaultSelected(
                    ticketData.find((t) => t.default_selected == true)?.id as string,
                  );
                  tempTicket.id != tempSelectedTicket?.id &&
                    setSelectedTicket(
                      Object.assign(
                        {},
                        ticketData.find((t) => t.id == tempTicket.id),
                      ),
                    );
                }}
              >
                Continue
              </button>
              <button
                onClick={() => {
                  setIsChangedModal(false);
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
      {deleteModal && (
        <Modal onClose={() => setDeleteModal(false)} style={{ zIndex: 999 }}>
          <div className={styles.modalContainer}>
            {/* Get Confirmation to continue event though user has not saved changes.*/}
            <div className={styles.sectionContent1}>
              <p className={styles.sectionSubTitle}>
                Are you sure you want to Delete{' '}
                {selectedTicket?.title ? selectedTicket?.title : 'this ticket'}?
              </p>
            </div>
            <div className={styles.modalButtons}>
              <button
                className={styles.confirmButton}
                onClick={() => {
                  onDeleteTicket();
                  setDeleteModal(false);
                }}
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setDeleteModal(false);
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
      {ticketData.length ? (
        // <Theme>
        <div className={styles.manageTicketsContainer}>
          <div className={styles.ticketHeader}>
            <div className={styles.ticketHeaderTitle}>Current Tickets</div>
            <button className={styles.ticketHeaderButton} onClick={onNewTicket}>
              + New Ticket Type
            </button>
          </div>
          <div className={styles.ticketsContainer}>
            {Array.from(new Set(tickets.map((ticket) => ticket.id))).map((id) => {
              const ticket = tickets.find((t) => t.id === id);
              return ticket ? (
                <TicketBox
                  key={ticket.id}
                  ticketInfo={ticket}
                  onClick={() => {
                    if (ticket.id != selectedTicket?.id) {
                      if (checkUnsavedChanges()) {
                        setIsChangedModal(true);
                        setTicketPair([ticket, selectedTicket as TicketType]);
                        return;
                      }
                      setSelectedTicket(Object.assign({}, ticket));
                    }
                  }}
                  selected={selectedTicket?.id == ticket.id}
                  closed={
                    selectedTicket?.id == ticket.id ? !selectedTicket?.is_active : !ticket.is_active
                  }
                  handleDefaultSelected={changeDefaultSelected}
                  checkUnsavedChanges={checkUnsavedChanges}
                />
              ) : null;
            })}
          </div>
          {selectedTicket && (
            <motion.div
              className={styles.ticketUpdateContainer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.ticketTitleContainer}>
                <label className={styles.ticketTitleLabel}>Ticket Title</label>
                <input
                  className={styles.ticketTitle}
                  placeholder='Ticket Title'
                  value={selectedTicket?.title}
                  onChange={(e) =>
                    setSelectedTicket({ ...selectedTicket, title: e.target.value } as TicketType)
                  }
                />
              </div>
              <div className={styles.ticketDescriptionContainer}>
                <label>Description</label>
                <textarea
                  className={styles.ticketDescription}
                  placeholder='Ticket Description'
                  value={selectedTicket?.description || ''}
                  onChange={(e) =>
                    setSelectedTicket({
                      ...selectedTicket,
                      description: e.target.value,
                    } as TicketType)
                  }
                />
              </div>

              <div className={styles.ticketSlider}>
                <p className={styles.ticketSliderLabel}>Require Approval</p>
                <Slider
                  checked={selectedTicket?.approval_required}
                  onChange={() => {
                    setSelectedTicket({
                      ...selectedTicket,
                      approval_required: !selectedTicket?.approval_required,
                    } as TicketType);
                  }}
                />
              </div>
              <div className={styles.ticketSlider}>
                <p className={styles.ticketSliderLabel}>Limit Capacity</p>
                <Slider
                  checked={selectedTicket?.capacity > 0}
                  onChange={() => {
                    if (selectedTicket?.capacity > 0) {
                      setSelectedTicket({
                        ...selectedTicket,
                        capacity: 0,
                      } as TicketType);
                    }
                    if (!selectedTicket?.capacity) {
                      const sameIdTicket = tickets.find((t) => t.id === selectedTicket?.id);

                      setSelectedTicket({
                        ...selectedTicket,
                        capacity:
                          sameIdTicket && sameIdTicket?.capacity > 0 ? sameIdTicket.capacity : 100,
                      } as TicketType);
                    }
                  }}
                />
              </div>
              {selectedTicket?.capacity > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={styles.ticketSlider}
                >
                  <div className={styles.ticketCapacityContainer}>
                    <label className={styles.ticketCapacityLabel}>Capacity</label>
                    <input
                      type='number'
                      placeholder='0'
                      value={selectedTicket?.capacity}
                      onChange={(e) =>
                        setSelectedTicket({
                          ...selectedTicket,
                          capacity: Number(e.target.value),
                        } as TicketType)
                      }
                      className={styles.ticketCapacityInput}
                    />
                  </div>
                </motion.div>
              )}
              <div className={styles.ticketSlider}>
                <p className={styles.ticketSliderLabel}>Paid Ticket</p>
                <Slider
                  checked={selectedTicket?.price > 0}
                  onChange={() => {
                    if (selectedTicket?.price > 0) {
                      setSelectedTicket({
                        ...selectedTicket,
                        price: 0,
                      } as TicketType);
                    }
                    if (!selectedTicket?.price) {
                      const sameIdTicket = tickets.find((t) => t.id === selectedTicket?.id);
                      setSelectedTicket({
                        ...selectedTicket,
                        price: sameIdTicket && sameIdTicket?.price > 0 ? sameIdTicket.price : 100,
                      } as TicketType);
                    }
                  }}
                />
              </div>
              {selectedTicket?.price > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={styles.ticketPriceDependentContainer}
                >
                  <div className={styles.ticketPriceContainer}>
                    <label className={styles.ticketPriceLabel}>Ticket Price</label>
                    <div className={styles.ticketPrice}>
                      <input
                        type='number'
                        placeholder='0'
                        value={selectedTicket?.price}
                        onChange={(e) =>
                          selectedTicket &&
                          setSelectedTicket({
                            ...selectedTicket,
                            price: parseInt(e.target.value),
                          } as TicketType)
                        }
                        className={styles.ticketPriceInput}
                      />
                      <p className={styles.ticketCurrency}>₹</p>
                    </div>
                  </div>

                  <div className={styles.ticketSlider}>
                    <p className={styles.ticketSliderLabel}>
                      Include Platform fee{' '}
                      <span
                        className={styles.feeReminder}
                      >{`( ₹${((selectedTicket?.platform_fee / 100) * selectedTicket?.price).toFixed(2)} )`}</span>
                    </p>
                    <Slider
                      checked={selectedTicket?.platform_fee_from_user}
                      onChange={() => {
                        selectedTicket &&
                          setSelectedTicket({
                            ...selectedTicket,
                            platform_fee_from_user: !selectedTicket.platform_fee_from_user,
                          } as TicketType);
                      }}
                    />
                  </div>
                </motion.div>
              )}
              <div className={styles.ticketSlider}>
                <p className={styles.ticketSliderLabel}>Close Ticket</p>
                <Slider
                  checked={!selectedTicket?.is_active}
                  onChange={() => {
                    setSelectedTicket({
                      ...selectedTicket,
                      is_active: !selectedTicket.is_active,
                    } as TicketType);
                  }}
                />
              </div>

              <div className={styles.buttonContainer}>
                <button className={styles.deleteButton} onClick={() => setDeleteModal(true)}>
                  Delete
                </button>
                <div className={styles.buttonGroup}>
                  <button className={styles.settingsButton} onClick={() => setIsOpen(true)}>
                    {' '}
                    <TbSettings />
                    Advanced Settings
                  </button>
                  <button
                    className={styles.updateButton}
                    onClick={selectedTicket?.new ? addTicket : updateTicket}
                  >
                    {selectedTicket?.new ? 'Create Ticket' : 'Update Ticket'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        // </Theme>
        <HashLoader color={'#46BF75'} size={50} />
      )}
    </>
  );
};

export default ManageTickets;
