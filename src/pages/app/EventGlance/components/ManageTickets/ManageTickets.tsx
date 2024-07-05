import { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import styles from './ManageTickets.module.css';
import Slider from '../../../../../components/SliderButton/Slider';
import TicketBox from './components/TicketBox/TicketBox';
import { TbSettings } from 'react-icons/tb';
import { EventType, TicketType } from '../../../../../apis/types';
import { editTicket, createTicket, deleteTicket, getTickets } from '../../../../../apis/tickets';
import Modal from '../../../../../components/Modal/Modal';
import { motion } from 'framer-motion';
import { HashLoader } from 'react-spinners';
import { isEqual } from 'lodash';
import toast from 'react-hot-toast';

export interface ChildProps {
  setIsTicketsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ChildRef {
  closeTicketModal: () => void;
}

const ManageTickets = forwardRef<ChildRef, ChildProps>(({ setIsTicketsOpen }, ref) => {
  const { event_id: eventId, event_name: eventName } = JSON.parse(
    sessionStorage.getItem('eventData') || '',
  );
  const [hasFetched, setHasFetched] = useState(false);
  const [ticketData, setTicketData] = useState<TicketType[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketType>();
  const [isOpen, setIsOpen] = useState(false);
  const [wantToClose, setWantToClose] = useState(false);
  const [isChangedModal, setIsChangedModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [limitCapacity, setLimitCapacity] = useState(true);
  const [paidTicket, setPaidTicket] = useState(true);
  const [ticketPair, setTicketPair] = useState<TicketType[]>();
  const getDeepCopy = (obj: any) => JSON.parse(JSON.stringify(obj));

  const onNewTicket = async () => {
    // setSettingNewTicket(true);
    if (tickets.findIndex((t) => t.default_selected == true) != -1) {
      const newTicket: TicketType = {
        ...(getDeepCopy(tickets.find((t) => t.default_selected == true)) as TicketType),
        title: 'New Ticket',
        description: '',
        id: '',
        default_selected: false,
        registration_count: 0,
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
      const newTicketId = await createTicket(eventId, newTicket as TicketType);
      if (newTicketId) {
        setTicketData((prevTickets) => [
          { ...(newTicket as TicketType), id: newTicketId },
          ...prevTickets,
        ]);
        setSelectedTicket({ ...(newTicket as TicketType), id: newTicketId });
      }
    } else {
      const newTicket: TicketType = {
        title: 'New Ticket',
        description: '',
        id: '',
        approval_required: false,
        price: 0,
        perks: undefined,
        registration_count: 0,
        capacity: 0,
        default_selected: true,
        platform_fee: 0,
        platform_fee_from_user: false,
        currency: '',
        entry_date: [],
        code_prefix: eventName.slice(0, 3).toUpperCase(),
        code_digits: 6,
        maintain_code_order: false,
        is_active: true,
      };
      const newTicketId = await createTicket(eventId, newTicket as TicketType);
      if (newTicketId) {
        setTicketData((prevTickets) => [
          { ...(newTicket as TicketType), id: newTicketId },
          ...prevTickets,
        ]);
        setSelectedTicket({ ...(newTicket as TicketType), id: newTicketId });
      }
    }
  };

  const onDeleteTicket = () => {
    const changeDefaultTo = tickets.find((ticket) => ticket.id != selectedTicket?.id);

    if (selectedTicket) {
      deleteTicket(eventId, selectedTicket.id, setTicketData).then(() => {
        if (selectedTicket?.default_selected && tickets.length > 1) {
          changeDefaultSelected(changeDefaultTo?.id as string);
        } else {
          setSelectedTicket(undefined);
        }
      });
    }
  };

  const updateTicket = async (specificUpdate?: TicketType) => {
    let selection = specificUpdate || selectedTicket;
    const matchingTicket = ticketData.find((ticket) => ticket.id === selection?.id);
    if (!paidTicket) {
      selection = { ...selection, price: 0 } as TicketType;
    }
    if (isNaN(selection?.capacity as number)) {
      selection = { ...selection, capacity: null } as TicketType;
      setLimitCapacity(false);
    }

    if (selection?.price == null || (selection?.price == 0 && paidTicket)) {
      selection = { ...selection, price: 0 } as TicketType;
      setPaidTicket(false);
    }

    if (matchingTicket) {
      const changedData: Record<string, any> = Object.entries(selection as Record<string, any>)
        .filter(([key, value]) => matchingTicket?.[key as keyof EventType] !== value)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

      if (changedData?.description == '' && matchingTicket?.description == null)
        delete changedData['description'];

      const formData = new FormData();
      for (const key in changedData) {
        formData.append(key, changedData[key]);
      }
      console.log(changedData);
      editTicket(eventId, selection as TicketType, formData, setTicketData).then(() => {
        setLimitCapacity(true);
        const capacityExists = Object.keys(changedData).includes('capacity');
        if (capacityExists && changedData?.capacity == null && changedData?.price == 0) {
          setTicketData((prevTickets) =>
            prevTickets.map((ticket) =>
              ticket.id == selection?.id
                ? ({ ...ticket, capacity: null, price: 0 } as unknown as TicketType)
                : ticket,
            ),
          );
          setSelectedTicket({ ...selection, capacity: null, price: 0 } as unknown as TicketType);
          setPaidTicket(false);
          return;
        } else if (capacityExists && changedData?.capacity == null) {
          setTicketData((prevTickets) =>
            prevTickets.map((ticket) =>
              ticket.id == selection?.id
                ? ({ ...ticket, capacity: null } as unknown as TicketType)
                : ticket,
            ),
          );
          setSelectedTicket({ ...selection, capacity: null } as unknown as TicketType);
        } else if (changedData?.price == 0) {
          setTicketData((prevTickets) =>
            prevTickets.map((ticket) =>
              ticket.id == selection?.id ? ({ ...ticket, price: 0 } as TicketType) : ticket,
            ),
          );
          setSelectedTicket({ ...selection, price: 0 } as TicketType);
          setPaidTicket(false);
        }
      });
    }
  };

  const hasUnsavedChanges = () => {
    if (selectedTicket?.new) return true;
    return !isEqual(
      selectedTicket,
      ticketData?.find((t) => t.id === selectedTicket?.id),
    );
  };

  const changeDefaultSelected = (ticketId: string) => {
    if (tickets.find((ticket) => ticket.id === ticketId && ticket.default_selected)) return;
    editTicket(
      eventId,
      tickets.find((t) => t.id === ticketId) as TicketType,
      { default_selected: true },
      setTicketData,
    )
      .then(() => {
        setTicketData(
          ticketData.map((ticket) =>
            ticket.id === ticketId
              ? { ...ticket, default_selected: true }
              : { ...ticket, default_selected: false },
          ),
        );
        setSelectedTicket({
          ...tickets.find((t) => t.id === ticketId),
          default_selected: true,
        } as TicketType);
      })
      .catch(() => {
        toast.error('Failed to set default ticket');
      });
  };

  const closeTicketModal = () => {
    if (!hasUnsavedChanges()) {
      setIsTicketsOpen(false);
    } else {
      setIsChangedModal(true);
      setWantToClose(true);
    }
  };

  useImperativeHandle(ref, () => ({
    closeTicketModal,
  }));

  useEffect(() => {
    if (eventId && !ticketData.length && !hasFetched) {
      getTickets(eventId, setTicketData);
      setHasFetched(true);
    }
  }, [eventId, ticketData]);

  useEffect(() => {
    setPaidTicket(selectedTicket?.price != 0);
    setLimitCapacity(true);
  }, [selectedTicket?.id]);

  useEffect(() => {
    setTickets(ticketData || []);
    if (tickets.length == 0) {
      ticketData?.forEach((ticket) => {
        if (ticket.default_selected) setSelectedTicket(ticket);
      });
    }
  }, [ticketData]);

  console.log(ticketData);

  console.log('price:', selectedTicket?.price, 'capacity:', selectedTicket?.capacity);
  console.log(paidTicket);
  return (
    <>
      {isOpen && (
        <Modal title='Advanced Setting' onClose={() => setIsOpen(false)} style={{ zIndex: 999 }}>
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
        <Modal title=' ' onClose={() => setIsChangedModal(false)} style={{ zIndex: 999 }}>
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
                  if (wantToClose) {
                    setIsTicketsOpen(false);
                    setWantToClose(false);
                    return;
                  }
                  const [tempTicket, tempSelectedTicket] = ticketPair as TicketType[];
                  tempTicket.id != tempSelectedTicket?.id &&
                    setSelectedTicket(
                      Object.assign(
                        {},
                        ticketData.find((t) => t.id == tempTicket.id),
                      ),
                    );
                }}
              >
                Continue without saving
              </button>
              <button
                onClick={() => {
                  setIsChangedModal(false);
                  const [tempTicket, tempSelectedTicket] = ticketPair as TicketType[];
                  tempTicket.id != tempSelectedTicket?.id &&
                    updateTicket(tempSelectedTicket as TicketType).then(() => {
                      setSelectedTicket(
                        Object.assign(
                          {},
                          ticketData.find((t) => t.id == tempTicket.id),
                        ),
                      );
                    });
                  if (wantToClose) {
                    setIsTicketsOpen(false);
                    setWantToClose(false);
                    return;
                  }
                }}
                className={styles.cancelButton}
              >
                Save changes and continue
              </button>
            </div>
          </div>
        </Modal>
      )}
      {deleteModal && (
        <Modal title=' ' onClose={() => setDeleteModal(false)} style={{ zIndex: 999 }}>
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
      {ticketData.length || hasFetched ? (
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
                      if (hasUnsavedChanges()) {
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
                  hasUnsavedChanges={hasUnsavedChanges}
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
                  checked={selectedTicket?.capacity != null && limitCapacity}
                  onChange={() => {
                    if (selectedTicket?.capacity != null && selectedTicket?.capacity > 0) {
                      setSelectedTicket({
                        ...selectedTicket,
                        capacity: null,
                      } as unknown as TicketType);
                    }
                    if (selectedTicket?.capacity == null) {
                      const sameIdTicket = tickets.find((t) => t.id === selectedTicket?.id);
                      setSelectedTicket({
                        ...selectedTicket,
                        capacity:
                          sameIdTicket?.capacity && sameIdTicket?.capacity > 0
                            ? sameIdTicket.capacity
                            : 100,
                      } as TicketType);
                    }
                    if (isNaN(selectedTicket?.capacity as number)) {
                      setLimitCapacity((prev) => !prev);
                    }
                  }}
                />
              </div>
              {selectedTicket?.capacity != null && limitCapacity && (
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
                      placeholder='Unlimited'
                      value={selectedTicket?.capacity}
                      onChange={(e) => {
                        if (Number(e.target.value) < 0) {
                          return;
                        }
                        setSelectedTicket({
                          ...selectedTicket,
                          capacity: parseInt(e.target.value),
                        } as TicketType);
                      }}
                      className={styles.ticketCapacityInput}
                    />
                  </div>
                </motion.div>
              )}
              <div className={styles.ticketSlider}>
                <p className={styles.ticketSliderLabel}>Paid Ticket</p>
                <Slider
                  checked={paidTicket}
                  onChange={() => {
                    setPaidTicket((prev) => !prev);
                  }}
                />
              </div>
              {paidTicket && (
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
                        onChange={(e) => {
                          if (Number(e.target.value) < 0) {
                            return;
                          }
                          if (isNaN(parseInt(e.target.value))) {
                            setSelectedTicket({
                              ...selectedTicket,
                              price: null,
                            } as unknown as TicketType);
                            return;
                          }
                          selectedTicket &&
                            setSelectedTicket({
                              ...selectedTicket,
                              price: parseInt(e.target.value),
                            } as TicketType);
                        }}
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
                  <button className={styles.updateButton} onClick={() => updateTicket()}>
                    {'Update Ticket'}
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
});

export default ManageTickets;
