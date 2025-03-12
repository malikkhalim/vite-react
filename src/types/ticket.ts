export interface TicketIssuanceResponse {
    success: boolean;
    bookingCode?: string;
    status?: string;
    ticketNumbers?: string[];
    error?: string;
  }