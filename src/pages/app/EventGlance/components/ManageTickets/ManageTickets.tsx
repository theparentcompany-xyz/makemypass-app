import { motion } from 'framer-motion';
import { isEqual } from 'lodash';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import toast from 'react-hot-toast';
import { TbSettings } from 'react-icons/tb';
import { HashLoader } from 'react-spinners';

import {
  createTicket,
  deleteTicket,
  getTicketsList,
  updateTicketData,
} from '../../../../../apis/tickets';
import { TicketType } from '../../../../../apis/types';
import { isUserEditor } from '../../../../../common/commonFunctions';
import Editor from '../../../../../components/Editor/Editor';
import DeleteModal from '../../../../../components/Modal/DeleteModal/DeleteModal';
import Modal from '../../../../../components/Modal/Modal';
import Slider from '../../../../../components/SliderButton/Slider';
import { useOverrideCtrlS } from '../../../../../hooks/common';
import AdvancedSetting from './components/AdvancedSetting/AdvancedSetting';
import TicketBox from './components/TicketBox/TicketBox';
import UnsavedChanges from './components/UnsavedChanges/UnsavedChanges';
import styles from './ManageTickets.module.css';

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
  const [newDescription, setNewDescription] = useState('');
  const getDeepCopy = (obj: TicketType | undefined) => JSON.parse(JSON.stringify(obj));

  const onNewTicket = async () => {
    if (tickets.findIndex((t) => t.default_selected == true) != -1 || tickets.length > 0) {
      const newTicket: TicketType = {
        ...(getDeepCopy(
          tickets.some((t) => t.default_selected == true)
            ? tickets.find((t) => t.default_selected == true)
            : tickets[tickets.length - 1],
        ) as TicketType),
        title: 'New Ticket',
        description: '',
        id: '',
        default_selected: false,
        registration_count: 0,
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
        perks: [],
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
        gateway_fee: 0,
        user_count: 0,
        category: '',
        allowed_dates: [],
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
      const changedData: Record<string, string | number | FileList> = Object.entries(
        selection as Record<string, string | number | FileList>,
      ).reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
      const formData = new FormData();
      Object.keys(changedData).forEach((key) => {
        let value = changedData[key];

        if (!(value instanceof FileList)) {
          if (Array.isArray(value) && value.length > 0) {
            value.forEach((value) =>
              formData.append(
                key + '[]',
                typeof value === 'object' ? JSON.stringify(value) : value,
              ),
            );
          } else if (changedData[key] != null) {
            value = changedData[key].toString();
          }
        }

        if (typeof value === 'string' && value.length > 0) {
          formData.append(key, value);
        } else if (value instanceof FileList) {
          Array.from(value).forEach((value) => formData.append(key + '[]', value));
        }
      });

      updateTicketData(eventId, selection as TicketType, formData, setTicketData).then(() => {
        setLimitCapacity(true);
        const capacityExists = Object.keys(changedData).includes('capacity');

        setTicketData((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id == selection?.id
              ? ({
                  ...ticket,
                  ...(capacityExists && changedData?.capacity == null && { capacity: null }),
                  ...(changedData?.price == 0 && { price: 0 }),
                  ...(changedData?.['description'] && { description: newDescription }),
                } as unknown as TicketType)
              : ticket,
          ),
        );
        setSelectedTicket({
          ...selection,
          ...(capacityExists && changedData?.capacity == null && { capacity: null }),
          ...(changedData?.price == 0 && { price: 0 }),
          ...(changedData?.['description'] && { description: newDescription }),
        } as unknown as TicketType);

        changedData?.price == 0 && setPaidTicket(false);
      });
    }
  };

  const calcTotalExtraFee = () => {
    if (!selectedTicket?.platform_fee_from_user) {
      return (
        (((selectedTicket?.platform_fee ?? 0) + (selectedTicket?.gateway_fee ?? 0)) / 100) *
        (selectedTicket?.price ?? 0)
      );
    } else {
      const target_amount = selectedTicket?.price * (1 + selectedTicket?.platform_fee / 100);

      const total_amount = target_amount / (1 - selectedTicket?.gateway_fee / 100);
      const gateway_amount = (selectedTicket?.gateway_fee / 100) * total_amount;
      const platform_amount = total_amount - selectedTicket?.price - gateway_amount;
      return platform_amount + gateway_amount;
    }
  };

  const hasUnsavedChanges = () => {
    const originalTicket = ticketData?.find((t) => t.id === selectedTicket?.id);
    if (!selectedTicket || !originalTicket) return false;
    const isDescriptionChanged =
      (selectedTicket?.description || '') !==
      (newDescription.replace(/<p class="bn-inline-content"><\/p>/g, '') || '');
    const isOtherDataChanged = !isEqual(selectedTicket, originalTicket);

    return isDescriptionChanged || isOtherDataChanged;
  };

  const changeDefaultSelected = (ticketId: string) => {
    if (tickets.find((ticket) => ticket.id === ticketId && ticket.default_selected)) {
      updateTicketData(
        eventId,
        tickets.find((t) => t.id === ticketId) as TicketType,
        { default_selected: false },
        setTicketData,
      )
        .then(() => {
          setTicketData(
            ticketData.map((ticket) =>
              ticket.id === ticketId ? { ...ticket, default_selected: false } : ticket,
            ),
          );
          setSelectedTicket({
            ...tickets.find((t) => t.id === ticketId),
            default_selected: false,
          } as TicketType);
        })
        .catch(() => {
          toast.error('Failed to set default ticket');
        });
    } else {
      updateTicketData(
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
    }
  };

  const closeTicketModal = () => {
    if (!hasUnsavedChanges()) {
      setIsTicketsOpen(false);
    } else {
      setIsChangedModal(true);
      setWantToClose(true);
      setTicketPair([
        ticketData.find((ticket) => ticket.id == selectedTicket?.id) as TicketType,
        selectedTicket as TicketType,
      ]);
    }
  };

  useOverrideCtrlS(updateTicket);

  useImperativeHandle(ref, () => ({
    closeTicketModal,
  }));

  useEffect(() => {
    if (eventId && !ticketData.length && !hasFetched) {
      getTicketsList(eventId, setTicketData);
      setHasFetched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, ticketData]);

  useEffect(() => {
    setPaidTicket(selectedTicket?.price != 0);
    setLimitCapacity(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTicket?.id]);

  useEffect(() => {
    setTickets(ticketData || []);

    if (tickets.length == 0) {
      if (ticketData?.some((ticket) => ticket.default_selected)) {
        ticketData?.forEach((ticket) => {
          if (ticket.default_selected) setSelectedTicket(ticket);
        });
      } else if (ticketData.length > 0) {
        setSelectedTicket(ticketData[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketData]);

  return (
    <>
      {isOpen && (
        <Modal
          type='side'
          title='Advanced Setting'
          onClose={() => setIsOpen(false)}
          style={{ zIndex: 999, alignItems: 'flex-start' }}
          zIndexCount={100}
        >
          <AdvancedSetting
            selectedTicket={selectedTicket as TicketType}
            setSelectedTicket={setSelectedTicket}
            setIsOpen={setIsOpen}
          />
        </Modal>
      )}
      {isChangedModal && (
        <Modal title=' ' onClose={() => setIsChangedModal(false)} style={{ zIndex: 999 }}>
          <UnsavedChanges
            setIsChangedModal={setIsChangedModal}
            setSelectedTicket={setSelectedTicket}
            setIsTicketsOpen={setIsTicketsOpen}
            ticketData={ticketData}
            ticketPair={ticketPair}
            wantToClose={wantToClose}
            setWantToClose={setWantToClose}
            updateTicket={updateTicket}
          />
        </Modal>
      )}
      {deleteModal && (
        <DeleteModal
          deleteText={`Are you sure you want to Delete ${selectedTicket?.title ? selectedTicket?.title : 'this ticket'}?`}
          setDeleteModal={setDeleteModal}
          onDelete={onDeleteTicket}
          style={{ zIndex: 999 }}
        />
      )}

      {ticketData.length || hasFetched ? (
        // <Theme>
        <div className={styles.manageTicketsContainer}>
          <div className={styles.ticketHeader}>
            <div className={styles.ticketHeaderTitle}>Current Tickets</div>
            {isUserEditor() && (
              <button className={styles.ticketHeaderButton} onClick={onNewTicket}>
                + New Ticket Type
              </button>
            )}
          </div>
          <div className={styles.ticketsContainer}>
            {tickets.map((ticket) => (
              <TicketBox
                key={ticket.id}
                ticketInfo={ticket}
                onClick={() => {
                  if (hasUnsavedChanges()) {
                    setIsChangedModal(true);
                    setTicketPair([ticket, selectedTicket as TicketType]);
                    return;
                  }
                  setSelectedTicket(Object.assign({}, ticket));
                }}
                selected={selectedTicket?.id == ticket.id}
                closed={
                  selectedTicket?.id == ticket.id ? !selectedTicket?.is_active : !ticket.is_active
                }
                handleDefaultSelected={changeDefaultSelected}
                hasUnsavedChanges={hasUnsavedChanges}
                // handleTicketClick={handleTicketClick}
              />
            ))}
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
                  disabled={!isUserEditor()}
                  value={selectedTicket?.title}
                  onChange={(e) =>
                    setSelectedTicket({ ...selectedTicket, title: e.target.value } as TicketType)
                  }
                />
              </div>
              <div className={styles.ticketDescriptionContainer}>
                <label>Description</label>

                <div className={styles.ticketDescription}>
                  <Editor
                    description={selectedTicket?.description}
                    setNewDescription={setNewDescription}
                  />
                </div>
              </div>

              <div className={styles.ticketSlider}>
                <p className={styles.ticketSliderLabel}>Require Approval</p>
                <Slider
                  checked={selectedTicket?.approval_required}
                  onChange={() => {
                    isUserEditor() &&
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
                    if (isUserEditor()) {
                      if (selectedTicket?.capacity != null && selectedTicket?.capacity >= 0) {
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
                      disabled={!isUserEditor()}
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
                    isUserEditor() && setPaidTicket((prev) => !prev);
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
                        disabled={!isUserEditor()}
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

                  {selectedTicket?.platform_fee + selectedTicket?.gateway_fee > 0 && (
                    <>
                      <div className={styles.ticketSlider}>
                        <p className={styles.ticketSliderLabel}>
                          Include Platform fee{' '}
                          <span className={styles.feeReminder}>{`( ₹${calcTotalExtraFee().toFixed(
                            2,
                          )} )`}</span>
                        </p>
                        <Slider
                          checked={selectedTicket?.platform_fee_from_user}
                          onChange={() => {
                            selectedTicket &&
                              isUserEditor() &&
                              setSelectedTicket({
                                ...selectedTicket,
                                platform_fee_from_user: !selectedTicket.platform_fee_from_user,
                              } as TicketType);
                          }}
                        />
                      </div>
                      <div className={styles.feeReminder}>
                        Platform Fee: {selectedTicket?.platform_fee}%
                      </div>
                      <div className={styles.feeReminder}>
                        Gateway Fee: {selectedTicket?.gateway_fee}%
                      </div>
                    </>
                  )}
                </motion.div>
              )}
              <div className={styles.ticketSlider}>
                <p className={styles.ticketSliderLabel}>Close Ticket</p>
                <Slider
                  checked={!selectedTicket?.is_active}
                  onChange={() => {
                    isUserEditor() &&
                      setSelectedTicket({
                        ...selectedTicket,
                        is_active: !selectedTicket.is_active,
                      } as TicketType);
                  }}
                />
              </div>

              <div className={styles.buttonContainer}>
                <div className={styles.buttonGroup}>
                  {isUserEditor() && (
                    <button className={styles.deleteButton} onClick={() => setDeleteModal(true)}>
                      Delete
                    </button>
                  )}
                  {isUserEditor() && (
                    <button className={styles.updateButton} onClick={() => updateTicket()}>
                      {'Update Ticket'}
                    </button>
                  )}
                </div>
                <button className={styles.settingsButton} onClick={() => setIsOpen(true)}>
                  {' '}
                  <TbSettings />
                  Advanced Settings
                </button>
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
